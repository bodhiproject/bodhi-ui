import { observable, action, runInAction, reaction, toJS } from 'mobx';
import axios from 'axios';
import { map, includes, isEmpty, remove, each, reduce, findIndex, cloneDeep } from 'lodash';
import { WalletProvider, TransactionType, TransactionStatus, Token, TransactionGas } from 'constants';
import { Transaction, TransactionCost } from 'models';
import { AbiCoder } from 'web3-eth-abi';
import promisify from 'js-promisify';
import { fromAscii } from 'web3-utils';

import networkRoutes from '../network/routes';
import { queryAllTransactions } from '../network/graphql/queries';
import { addPendingEvent, createTransaction } from '../network/graphql/mutations';
import getContracts from '../config/contracts';
import Tracking from '../helpers/mixpanelUtil';

const web3EthAbi = new AbiCoder();
const INIT_VALUES = {
  visible: false,
  provider: WalletProvider.NAKA,
};

const CREATE_EVENT_FUNC_SIG = '2b2601bf';
const BET_EVENT_FUNC_SIG = '885ab66d';
const SET_EVENT_FUNC_SIG = 'a6b4218b';
const VOTE_EVENT_FUNC_SIG = '1e00eb7f';
const createEventFuncTypes = [
  'string',
  'bytes32[10]',
  'uint256',
  'uint256',
  'uint256',
  'uint256',
  'address',
];
const playEventFuncTypes = [
  'uint8',
];

export default class TransactionStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
  @observable transactions = [];
  app = undefined;

  constructor(app) {
    this.app = app;

    // Visiblity of execute tx dialog changes
    reaction(
      () => this.visible,
      () => {
        if (!this.visible) {
          Object.assign(this, INIT_VALUES);
        }
      }
    );
    // New block change
    reaction(
      () => this.app.global.syncBlockNum,
      () => this.checkPendingApproves(),
    );
    // Naka Wallet logged in/out
    reaction(
      () => this.app.naka.loggedIn,
      () => {
        if (this.app.naka.loggedIn) {
          this.checkPendingApproves();
        } else {
          Object.assign(this, INIT_VALUES);
          this.transactions.clear();
        }
      }
    );
  }

  /**
   * Gets the array of pending approve txs for this client.
   * @return {array} Array of pending approve txs.
   */
  getPendingApproves = () => {
    const pending = localStorage.getItem('pendingApproves');
    return pending ? pending.split(',') : [];
  }

  /**
   * Stores a txid of a pending approve transaction.
   * @param {string} txid Transaction ID of a pending approve tx.
   */
  addPendingApprove = (txid) => {
    const pending = this.getPendingApproves();
    if (!includes(pending, txid)) pending.push(txid);
    localStorage.setItem('pendingApproves', pending);
  };

  /**
   * Removes a txid of a pending approve transaction.
   * @param {string} txid Transaction ID to remove.
   */
  removePendingApprove = (txid) => {
    let pending = this.getPendingApproves();
    if (includes(pending, txid)) {
      pending = remove(pending, txid);
      localStorage.setItem('pendingApproves', pending);
    }
  };

  createEvent = async ({
    nbotMethods,
    eventParams,
    eventFactoryAddr,
    escrowAmt,
    gas,
  }) => {
    try {
      // Construct params
      const paramsHex = web3EthAbi.encodeParameters(
        createEventFuncTypes,
        eventParams,
      ).substr(2);
      const data = `0x${CREATE_EVENT_FUNC_SIG}${paramsHex}`;
      // Send tx
      const txid = await promisify(nbotMethods.transfer['address,uint256,bytes'].sendTransaction, [eventFactoryAddr, escrowAmt, data, { gas }]);
      return txid;
    } catch (err) {
      throw err; // TODO: show errror message and show error in error dialog
    }
  };

  playEvent = async ({
    nbotMethods,
    params,
    eventAddr,
    eventFuncSig,
    amount,
    gas,
  }) => {
    try {
      // Construct params
      const paramsHex = web3EthAbi.encodeParameters(
        playEventFuncTypes,
        params,
      ).substr(2);
      const data = `0x${eventFuncSig}${paramsHex}`;
      // Send tx
      const txid = await promisify(nbotMethods.transfer['address,uint256,bytes'].sendTransaction, [eventAddr, amount, data, { gas }]);
      return txid;
    } catch (err) {
      throw err; // TODO: show errror message and show error in error dialog
    }
  };

  /**
   * Checks for successful approve txs. If they are successful, adds a tx to the list of txs to confirm.
   */
  @action
  checkPendingApproves = async () => {
    if (!this.app.naka.loggedIn) {
      return;
    }

    const pending = this.getPendingApproves();
    if (!isEmpty(pending)) {
      // Get all txs from DB
      const filters = reduce(pending, (result, value) => {
        result.push({ txid: value });
        return result;
      }, []);
      const txs = await queryAllTransactions(filters);

      each(txs, async (tx) => {
        // Execute follow-up tx if not already added, sender is in current addresses, and approve was successful
        const txIndex = findIndex(this.transactions, { approveTxid: tx.txid });
        const addressIndex = findIndex(this.app.wallet.addresses, { address: tx.senderAddress });
        if (txIndex === -1 && addressIndex !== -1 && tx.status === TransactionStatus.SUCCESS) {
          const { txid, senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi } = tx;
          switch (tx.type) {
            case TransactionType.APPROVE_CREATE_EVENT: {
              await this.addCreateEventTx(
                txid,
                senderAddress,
                tx.name,
                tx.options,
                tx.resultSetterAddress,
                tx.bettingStartTime,
                tx.bettingEndTime,
                tx.resultSettingStartTime,
                tx.resultSettingEndTime,
                amountSatoshi,
                tx.language,
              );
              break;
            }
            case TransactionType.APPROVE_SET_RESULT: {
              await this.addSetResultTx(txid, senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi);
              break;
            }
            case TransactionType.APPROVE_VOTE: {
              await this.addVoteTx(txid, senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi);
              break;
            }
            default: {
              break;
            }
          }
        }
      });
    }

    // Show confirm dialog if there are pending txs
    if (this.transactions.length > 0) {
      this.visible = true;
    }
  }

  /**
   * Gets the tx costs for each tx and shows the confirmation dialog.
   */
  @action
  showConfirmDialog = async () => {
    try {
      // each(this.transactions, async (tx) => {
      //   const { data } = await axios.post(networkRoutes.api.transactionCost, {
      //     type: tx.type,
      //     senderAddress: tx.senderAddress,
      //     topicAddress: tx.topicAddress,
      //     oracleAddress: tx.oracleAddress,
      //     optionIdx: tx.optionIdx,
      //     amount: tx.amountSatoshi,
      //     token: tx.token,
      //   });
      //   tx.fees = map(data, (item) => new TransactionCost(item));
      // });

      runInAction(() => {
        this.visible = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, networkRoutes.api.transactionCost);
      });
    }
  }

  /**
   * Confirms a tx and executes it.
   * @param {number} index Index of the tx to execute.
   */
  confirmTx = async (index) => {
    const tx = cloneDeep(this.transactions[index]);
    this.deleteTx(index, tx.approveTxid);

    const confirmFunc = {
      [TransactionType.RESET_APPROVE]: this.executeResetApprove,
      [TransactionType.APPROVE_CREATE_EVENT]: this.executeApproveCreateEvent,
      [TransactionType.CREATE_EVENT]: this.executeCreateEvent,
      [TransactionType.BET]: this.executeBet,
      [TransactionType.APPROVE_SET_RESULT]: this.executeApproveSetResult,
      [TransactionType.SET_RESULT]: this.executeSetResult,
      [TransactionType.APPROVE_VOTE]: this.executeApproveVote,
      [TransactionType.VOTE]: this.executeVote,
      [TransactionType.WITHDRAW]: this.executeWithdraw,
      [TransactionType.WITHDRAW_ESCROW]: this.executeWithdraw,
      [TransactionType.TRANSFER]: this.executeTransfer,
    };
    await confirmFunc[tx.type](index, tx);
  }

  /**
   * Logic to execute after a tx has been executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  // TODO: handle for specific types
  onTxExecuted = async (tx, pendingTx) => {
    // Refresh detail page if one the same page
    if (tx.topicAddress && tx.topicAddress === this.app.eventPage.topicAddress) {
      await this.app.eventPage.addPendingTx(pendingTx);
    }

    this.app.txSentDialog.open(tx.txid);
  }

  /**
   * Removes a tx from the transactions array and any pending approve from the localStorage.
   * @param {number} index Index of the tx to remove.
   * @param {string} approveTxid Approve txid if it is an approve tx.
   */
  @action
  deleteTx = (index, approveTxid) => {
    this.transactions.splice(index, 1);
    if (this.transactions.length === 0) {
      this.visible = false;
    }

    if (approveTxid) {
      this.removePendingApprove(approveTxid);
    }
  }

  /**
   * Executes an approve.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApprove = async (senderAddress, spender, amountSatoshi) => {
    const bodhiToken = getContracts().BodhiToken;
    const contract = this.app.global.qweb3.Contract(bodhiToken.address, bodhiToken.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('approve', {
      methodArgs: [spender, amountSatoshi],
      senderAddress,
    });
    return { txid, gasLimit, gasPrice };
  }

  /**
   * Adds a reset approve tx to the queue.
   * @param {string} spender Address to reset the allowance for.
   * @param {string} topicAddress Address of the TopicEvent. Only for Set Result and Vote.
   * @param {string} oracleAddress Address of the Oracle. Only for Set Result and Vote.
   */
  @action
  addResetApproveTx = async (spender, topicAddress, oracleAddress) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.RESET_APPROVE,
      senderAddress: this.app.wallet.currentAddress,
      receiverAddress: spender,
      topicAddress,
      oracleAddress,
      amount: '0',
      token: Token.NBOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes an approve to reset the allowance to 0.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeResetApprove = async (index, tx) => {
    try {
      const { senderAddress, receiverAddress, amount } = tx;
      const { txid, gasLimit, gasPrice } = await this.executeApprove(senderAddress, receiverAddress, amount);
      if (!txid) throw Error('Error executing approve.');

      // Create pending tx on server
      Object.assign(tx, { txid, gasLimit, gasPrice });
      await createTransaction('resetApprove', {
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        receiverAddress: tx.receiverAddress,
        topicAddress: tx.topicAddress,
        oracleAddress: tx.oracleAddress,
        amount,
      });

      await this.onTxExecuted(tx);
      Tracking.track('event-resetApprove');
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/reset-approve`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/reset-approve`);
      }
    }
  }

  /**
   * Adds a create event tx to the queue.
   * @param {string} approveTxid Txid of the approve.
   * @param {string} senderAddress Address of the sender.
   * @param {string} name Name of the event.
   * @param {array} options String array of the options for the event.
   * @param {string} resultSetterAddress Address of the result setter.
   * @param {string} bettingStartTime Unix timestamp of the betting start time.
   * @param {string} bettingEndTime Unix timestamp of the betting end time.
   * @param {string} resultSettingStartTime Unix timestamp of the result setting start time.
   * @param {string} resultSettingEndTime Unix timestamp of the result setting end time.
   * @param {string} amount Escrow amount in Botoshi.
   */
  @action
  addCreateEventTx = async (
    approveTxid,
    senderAddress,
    name,
    options,
    resultSetterAddress,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    amount,
    language,
  ) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.CREATE_EVENT,
      senderAddress,
      name,
      options,
      resultSetterAddress,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      amount,
      token: Token.NBOT,
      language,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a create event.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeCreateEvent = async (tx) => {
    try {
      const {
        senderAddress,
        centralizedOracle,
        name,
        results,
        betStartTime,
        betEndTime,
        resultSetStartTime,
        resultSetEndTime,
        amountSatoshi,
        language,
      } = tx;

      const createEventParams = [
        name,
        toJS(results),
        betStartTime,
        betEndTime,
        resultSetStartTime,
        resultSetEndTime,
        centralizedOracle,
      ];
      for (let i = 0; i < 10; i++) {
        if (createEventParams[1][i]) {
          createEventParams[1][i] = fromAscii(createEventParams[1][i]);
        } else {
          createEventParams[1][i] = fromAscii('');
        }
      }

      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi).at(getContracts().NakaBodhiToken.address);
      const txid = await this.createEvent({
        nbotMethods,
        eventParams: createEventParams,
        eventFactoryAddr: getContracts().EventFactory.address,
        escrowAmt: amountSatoshi,
        gas: 3000000,
      });

      Object.assign(tx, { txid });
      // Create pending tx on server
      if (txid) {
        const { graphqlClient } = this.app;
        const res = await addPendingEvent(graphqlClient, {
          txid,
          blockNum: this.app.global.syncBlockNum,
          ownerAddress: senderAddress,
          version: 0,
          name,
          results: createEventParams[1],
          numOfResults: results.length,
          centralizedOracle,
          betStartTime,
          betEndTime,
          resultSetStartTime,
          resultSetEndTime,
          language,
        });

        await this.onTxExecuted(res);
        this.app.prediction.loadFirst();
        Tracking.track('event-createEvent');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, 'network/create-event');
      } else {
        this.app.components.globalDialog.setError(err.message, '/create-event');
      }
    }
  }

  /**
   * Adds a bet tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {number} optionIdx Index of the option being bet.
   * @param {string} amount Amount of the bet.
   */
  @action
  addBetTx = async (topicAddress, oracleAddress, optionIdx, amount) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.BET,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount,
      token: Token.NAKA,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a bet.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeBet = async (index, tx) => {
    try {
      const { oracleAddress, optionIdx, amount, senderAddress } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi).at(getContracts().NakaBodhiToken.address);
      const betParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: betParams,
        eventAddr: oracleAddress,
        eventFuncSig: BET_EVENT_FUNC_SIG,
        amount,
        gas: 300000,
      });
      Object.assign(tx, { txid });
      if (txid) {
        // Create pending tx on server
        const pendingTx = await createTransaction('createBet', {
          txid,
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount,
        });

        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-bet');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/bet`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/bet`);
      }
    }
  }

  /**
   * Adds an approve set result tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {number} optionIdx Index of the option being set.
   * @param {string} amountSatoshi Approve amount.
   */
  @action
  addApproveSetResultTx = async (topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_SET_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.NBOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes an approve for a set result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveSetResult = async (index, tx) => {
    try {
      const { senderAddress, topicAddress, amountSatoshi } = tx;
      const { txid, gasLimit, gasPrice } = await this.executeApprove(senderAddress, topicAddress, amountSatoshi);
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        const pendingTx = await createTransaction('approveSetResult', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress,
          oracleAddress: tx.oracleAddress,
          optionIdx: tx.optionIdx,
          amount: amountSatoshi,
        });

        this.addPendingApprove(txid);
        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-approveSetResult');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/approve-set-result`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/approve-set-result`);
      }
    }
  }

  /**
   * Adds a set result tx to the queue.
   * @param {string} approveTxid Txid of the approve.
   * @param {string} senderAddress Address of the sender.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {number} optionIdx Index of the option being set.
   * @param {string} amountSatoshi Consensus threshold.
   */
  @action
  addSetResultTx = async (approveTxid, senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.SET_RESULT,
      senderAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.NBOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a set result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeSetResult = async (index, tx) => {
    try {
      const { senderAddress, oracleAddress, optionIdx } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi).at(getContracts().NakaBodhiToken.address);
      const setResultParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: setResultParams,
        eventAddr: oracleAddress,
        eventFuncSig: SET_EVENT_FUNC_SIG,
        amount: '10000000000', // TODO: get set result amount from where it defines, change to Event.consensusThreshold later
        gas: 500000,
      });

      Object.assign(tx, { txid });
      // Create pending tx on server
      if (txid) {
        const pendingTx = await createTransaction('setResult', {
          txid,
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount: tx.amountSatoshi,
        });

        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-setResult');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/set-result`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/set-result`);
      }
    }
  }

  /**
   * Adds a approve vote tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   * @param {number} optionIdx Index of the option being voted on.
   * @param {string} amountSatoshi Approve amount.
   */
  @action
  addApproveVoteTx = async (topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_VOTE,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.NBOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes an approve for a vote.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveVote = async (index, tx) => {
    try {
      const { senderAddress, topicAddress, amountSatoshi } = tx;
      const { txid, gasLimit, gasPrice } = await this.executeApprove(senderAddress, topicAddress, amountSatoshi);
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        const pendingTx = await createTransaction('approveVote', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress,
          oracleAddress: tx.oracleAddress,
          optionIdx: tx.optionIdx,
          amount: amountSatoshi,
        });

        this.addPendingApprove(txid);
        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-approveVote');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/approve-vote`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/approve-vote`);
      }
    }
  }

  /**
   * Adds a vote tx to the queue.
   * @param {string} approveTxid Txid of the approve.
   * @param {string} senderAddress Address of the sender.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   * @param {number} optionIdx Index of the option being voted on.
   * @param {string} amountSatoshi Vote amount.
   */
  @action
  addVoteTx = async (approveTxid, senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.VOTE,
      senderAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.NBOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a vote.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeVote = async (index, tx) => {
    try {
      const { senderAddress, oracleAddress, optionIdx, amountSatoshi } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi).at(getContracts().NakaBodhiToken.address);
      const voteParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: voteParams,
        eventAddr: oracleAddress,
        eventFuncSig: VOTE_EVENT_FUNC_SIG,
        amount: amountSatoshi,
        gas: 300000,
      });
      Object.assign(tx, { txid });

      // Create pending tx on server
      if (txid) {
        const pendingTx = await createTransaction('createVote', {
          txid,
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount: amountSatoshi,
        });

        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-vote');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/vote`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/vote`);
      }
    }
  }

  /**
   * Adds a withdraw tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   */
  @action
  addWithdrawTx = async (type, topicAddress) => {
    this.transactions.push(observable.object(new Transaction({
      type,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a withdraw or withdraw escrow..
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeWithdraw = async (index, tx) => {
    try {
      const { type, senderAddress, topicAddress } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().MultipleResultsEvent.abi).at(topicAddress);
      const txid = await promisify(nbotMethods.withdraw, []);

      Object.assign(tx, { txid });

      if (txid) {
        // Create pending tx on server
        const pendingTx = await createTransaction('withdraw', {
          type,
          txid,
          senderAddress,
          topicAddress,
        });

        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-withdraw');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/withdraw`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/withdraw`);
      }
    }
  }

  /**
   * Adds a transfer tx to the queue.
   * @param {string} senderAddress Sender of the transfer.
   * @param {string} receiverAddress Receiver of the transfer.
   * @param {number|string} amount Amount of the transfer.
   * @param {string} token Token type.
   */
  @action
  addTransferTx = async (senderAddress, receiverAddress, amount, token) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.TRANSFER,
      senderAddress,
      receiverAddress,
      amount,
      token,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a transfer.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeTransfer = async (index, tx) => {
    try {
      const pendingTx = await createTransaction('transfer', {
        senderAddress: tx.senderAddress,
        receiverAddress: tx.receiverAddress,
        amount: tx.amount,
        token: tx.token,
      });

      await this.onTxExecuted(pendingTx);
      await this.app.myWallet.history.addTransaction(pendingTx);
      Tracking.track('wallet-transfer');
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/transfer`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/transfer`);
      }
    }
  }
}
