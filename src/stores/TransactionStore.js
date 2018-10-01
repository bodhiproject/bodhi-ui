import { observable, action, runInAction, reaction } from 'mobx';
import axios from 'axios';
import { map, includes, isEmpty, remove, each, reduce, findIndex } from 'lodash';
import { WalletProvider, TransactionType, TransactionStatus, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';

import networkRoutes from '../network/routes';
import { queryAllTransactions } from '../network/graphql/queries';
import { createTransaction } from '../network/graphql/mutations';
import getContracts from '../config/contracts';
import Tracking from '../helpers/mixpanelUtil';

const INIT_VALUES = {
  visible: false,
  provider: WalletProvider.QRYPTO,
  type: undefined,
  action: undefined,
  option: undefined,
  amount: undefined,
  token: undefined,
  topicAddress: undefined,
  oracleAddress: undefined,
  senderAddress: undefined,
  fees: [],
  confirmedFunc: undefined,
};

export default class TransactionStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
  @observable transactions = [];

  @observable type = INIT_VALUES.type;
  @observable action = INIT_VALUES.action;
  @observable option = INIT_VALUES.option;
  @observable amount = INIT_VALUES.amount;
  @observable token = INIT_VALUES.token;
  @observable topicAddress = INIT_VALUES.topicAddress;
  @observable oracleAddress = INIT_VALUES.oracleAddress;
  @observable senderAddress = INIT_VALUES.senderAddress;
  @observable fees = INIT_VALUES.fees;
  confirmedFunc = INIT_VALUES.confirmedFunc;
  app = undefined;

  constructor(app) {
    this.app = app;

    reaction(
      () => this.visible,
      () => {
        if (!this.visible) {
          Object.assign(this, INIT_VALUES);
        }
      }
    );
    reaction(
      () => this.app.global.syncBlockNum,
      () => this.checkPendingApproves(),
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

  /**
   * Checks for successful approve txs. If they are successful, adds a tx to the list of txs to confirm.
   */
  @action
  checkPendingApproves = async () => {
    const pending = this.getPendingApproves();
    if (!isEmpty(pending)) {
      // Get all txs from DB
      const filters = reduce(pending, (result, value) => {
        result.push({ txid: value });
        return result;
      }, []);
      let txs = await queryAllTransactions(filters);
      txs = map(txs, (tx) => new Transaction(tx));

      each(txs, async (tx) => {
        // Execute follow-up tx if successful approve and not already added
        const index = findIndex(this.transactions, { approveTxid: tx.txid });
        if (index === -1 && tx.status === TransactionStatus.SUCCESS) {
          switch (tx.type) {
            case TransactionType.APPROVE_CREATE_EVENT: {
              await this.addCreateEventTx(
                tx.txid,
                tx.name,
                tx.options,
                tx.resultSetterAddress,
                tx.bettingStartTime,
                tx.bettingEndTime,
                tx.resultSettingStartTime,
                tx.resultSettingEndTime,
                tx.amountSatoshi,
              );
              break;
            }
            case TransactionType.APPROVE_SET_RESULT: {
              await this.addSetResultTx(tx.txid, tx.topicAddress, tx.oracleAddress, tx.optionIdx, tx.amountSatoshi);
              break;
            }
            case TransactionType.APPROVE_VOTE: {
              await this.addVoteTx(tx.txid, tx.topicAddress, tx.oracleAddress, tx.optionIdx, tx.amountSatoshi);
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
      each(this.transactions, async (tx) => {
        const { data } = await axios.post(networkRoutes.api.transactionCost, {
          type: tx.type,
          senderAddress: tx.senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress: tx.oracleAddress,
          optionIdx: tx.optionIdx,
          amount: tx.amountSatoshi,
          token: tx.token,
        });
        tx.fees = map(data, (item) => new TransactionCost(item));
      });

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
    const tx = this.transactions[index];
    const confirmFunc = {
      [TransactionType.RESET_APPROVE]: this.executeResetApprove,
      [TransactionType.APPROVE_CREATE_EVENT]: this.executeApproveCreateEvent,
      [TransactionType.CREATE_EVENT]: this.executeCreateEvent,
      [TransactionType.BET]: this.executeBet,
      [TransactionType.APPROVE_SET_RESULT]: this.executeApproveSetResult,
      [TransactionType.SET_RESULT]: this.executeSetResult,
      [TransactionType.APPROVE_VOTE]: this.executeApproveVote,
      [TransactionType.VOTE]: this.executeVote,
      [TransactionType.FINALIZE_RESULT]: this.executeFinalizeResult,
      [TransactionType.WITHDRAW]: this.executeWithdraw,
      [TransactionType.WITHDRAW_ESCROW]: this.executeWithdraw,
      [TransactionType.TRANSFER]: this.executeTransfer,
    };
    await confirmFunc[tx.type](index, tx);
  }

  /**
   * Logic to execute after a tx has been executed.
   * @param {number} index Index of the tx that was executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  onTxExecuted = async (index, tx) => {
    // Refresh detail page if one the same page
    if (tx.topicAddress && tx.topicAddress === this.app.eventPage.topicAddress) {
      await this.app.eventPage.queryTransactions(tx.topicAddress);
    }

    this.app.txSentDialog.open(tx.txid);
    await this.app.pendingTxsSnackbar.init();
    this.deleteTx(index);
  }

  /**
   * Removes a tx from the transactions array.
   * @param {number} index Index of the tx to remove.
   */
  @action
  deleteTx = (index) => {
    const tx = this.transactions[index];
    if (tx.approveTxid) {
      this.removePendingApprove(tx.approveTxid);
    }

    this.transactions.splice(index, 1);
    if (this.transactions.length === 0) {
      this.visible = false;
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
   */
  @action
  addResetApproveTx = async (spender) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.RESET_APPROVE,
      senderAddress: this.app.wallet.currentAddress,
      receiverAddress: spender,
      amount: '0',
      token: Token.BOT,
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
        amount,
      });

      await this.onTxExecuted(index, tx);
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
   * Adds an approve create event tx to the queue.
   * @param {string} name Name of the event.
   * @param {array} options String array of the options for the event.
   * @param {string} resultSetterAddress Address of the result setter.
   * @param {string} bettingStartTime Unix timestamp of the betting start time.
   * @param {string} bettingEndTime Unix timestamp of the betting end time.
   * @param {string} resultSettingStartTime Unix timestamp of the result setting start time.
   * @param {string} resultSettingEndTime Unix timestamp of the result setting end time.
   * @param {string} amountSatoshi Escrow amount.
   */
  @action
  addApproveCreateEventTx = async (
    name,
    options,
    resultSetterAddress,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    amountSatoshi,
  ) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_CREATE_EVENT,
      senderAddress: this.app.wallet.currentAddress,
      name,
      options,
      resultSetterAddress,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      amount: amountSatoshi,
      token: Token.BOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes an approve for a create event.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveCreateEvent = async (index, tx) => {
    try {
      const { senderAddress, amountSatoshi } = tx;
      const { txid, gasLimit, gasPrice } = await this.executeApprove(
        senderAddress,
        getContracts().AddressManager.address,
        amountSatoshi,
      );
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        await createTransaction('approveCreateEvent', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          name: tx.name,
          options: tx.options,
          resultSetterAddress: tx.resultSetterAddress,
          bettingStartTime: tx.bettingStartTime,
          bettingEndTime: tx.bettingEndTime,
          resultSettingStartTime: tx.resultSettingStartTime,
          resultSettingEndTime: tx.resultSettingEndTime,
          amount: amountSatoshi,
        });

        this.addPendingApprove(txid);
        await this.onTxExecuted(index, tx);
        Tracking.track('event-approveCreateEvent');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/approve-create-event`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/approve-create-event`);
      }
    }
  }

  /**
   * Adds a create event tx to the queue.
   * @param {string} approveTxid Txid of the approve.
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
    name,
    options,
    resultSetterAddress,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    amount,
  ) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.CREATE_EVENT,
      senderAddress: this.app.wallet.currentAddress,
      name,
      options,
      resultSetterAddress,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      amount,
      token: Token.BOT,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a create event.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeCreateEvent = async (index, tx) => {
    try {
      const {
        senderAddress,
        resultSetterAddress,
        name,
        options,
        bettingStartTime,
        bettingEndTime,
        resultSettingStartTime,
        resultSettingEndTime,
        amountSatoshi,
      } = tx;
      const contract = this.app.global.qweb3.Contract(
        getContracts().EventFactory.address,
        getContracts().EventFactory.abi,
      );
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('createTopic', {
        methodArgs: [
          resultSetterAddress,
          name,
          options,
          bettingStartTime,
          bettingEndTime,
          resultSettingStartTime,
          resultSettingEndTime,
        ],
        gasLimit: 3500000,
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        await createTransaction('createEvent', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          resultSetterAddress,
          name,
          options,
          bettingStartTime,
          bettingEndTime,
          resultSettingStartTime,
          resultSettingEndTime,
          amount: amountSatoshi,
          token: Token.BOT,
        });

        await this.onTxExecuted(index, tx);
        this.app.qtumPrediction.loadFirst();
        Tracking.track('event-createEvent');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/create-event`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/create-event`);
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
      token: Token.QTUM,
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
      const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().CentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('bet', {
        methodArgs: [optionIdx],
        amount,
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      if (txid) {
        // Create pending tx on server
        await createTransaction('createBet', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount,
        });

        await this.onTxExecuted(index, tx);
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
      token: Token.BOT,
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
        await createTransaction('approveSetResult', {
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
        await this.onTxExecuted(index, tx);
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
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {number} optionIdx Index of the option being set.
   * @param {string} amountSatoshi Consensus threshold.
   */
  @action
  addSetResultTx = async (approveTxid, topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.SET_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.BOT,
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
      const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().CentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('setResult', {
        methodArgs: [optionIdx],
        gasLimit: 1500000,
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        await createTransaction('setResult', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount: tx.amountSatoshi,
        });

        await this.onTxExecuted(index, tx);
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
      token: Token.BOT,
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
        await createTransaction('approveVote', {
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
        await this.onTxExecuted(index, tx);
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
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   * @param {number} optionIdx Index of the option being voted on.
   * @param {string} amountSatoshi Vote amount.
   */
  @action
  addVoteTx = async (approveTxid, topicAddress, oracleAddress, optionIdx, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.VOTE,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount: amountSatoshi,
      token: Token.BOT,
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
      const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().DecentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('voteResult', {
        methodArgs: [optionIdx, amountSatoshi],
        gasLimit: 1500000, // TODO: determine gas limit to use
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      // Create pending tx on server
      if (txid) {
        await createTransaction('createVote', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
          optionIdx,
          amount: amountSatoshi,
        });

        await this.onTxExecuted(index, tx);
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
   * Adds a finalize result tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   */
  @action
  addFinalizeResultTx = async (topicAddress, oracleAddress) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.FINALIZE_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
    })));
    await this.showConfirmDialog();
  }

  /**
   * Executes a finalize result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeFinalizeResult = async (index, tx) => {
    try {
      const { senderAddress, oracleAddress } = tx;
      const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().DecentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('finalizeResult', {
        methodArgs: [],
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      if (txid) {
        // Create pending tx on server
        await createTransaction('finalizeResult', {
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress: tx.topicAddress,
          oracleAddress,
        });

        await this.onTxExecuted(index, tx);
        Tracking.track('event-finalizeResult');
      }
    } catch (err) {
      if (err.networkError && err.networkError.result.errors && err.networkError.result.errors.length > 0) {
        this.app.components.globalDialog.setError(`${err.message} : ${err.networkError.result.errors[0].message}`, `${networkRoutes.graphql.http}/finalize-result`);
      } else {
        this.app.components.globalDialog.setError(err.message, `${networkRoutes.graphql.http}/finalize-result`);
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
      const contract = this.app.global.qweb3.Contract(topicAddress, getContracts().TopicEvent.abi);
      const methodName = type === TransactionType.WITHDRAW ? 'withdrawWinnings' : 'withdrawEscrow';
      const { txid, args: { gasLimit, gasPrice } } = await contract.send(methodName, {
        methodArgs: [],
        senderAddress,
      });
      Object.assign(tx, { txid, gasLimit, gasPrice });

      if (txid) {
        // Create pending tx on server
        await createTransaction('withdraw', {
          type,
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress,
          topicAddress,
        });

        await this.onTxExecuted(index, tx);
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
      const { data: { transfer } } = await createTransaction('transfer', {
        senderAddress: tx.senderAddress,
        receiverAddress: tx.receiverAddress,
        amount: tx.amount,
        token: tx.token,
      });
      const newTx = observable.object(new Transaction(transfer));

      await this.onTxExecuted(index, newTx);
      await this.app.myWallet.history.addTransaction(newTx);
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
