import { observable, action, runInAction, reaction } from 'mobx';
import axios from 'axios';
import { map, includes, isEmpty, remove, each, reduce, findIndex } from 'lodash';
import { WalletProvider, TransactionType, TransactionStatus, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';

import networkRoutes from '../network/routes';
import { queryAllTransactions } from '../network/graphql/queries';
import { createTransaction, createBetTx, createApproveSetResultTx, createSetResultTx, createApproveVoteTx, createVoteTx, createFinalizeResultTx, createWithdrawTx } from '../network/graphql/mutations';
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
        this.app.ui.setError(error.message, networkRoutes.api.transactionCost);
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
      [TransactionType.APPROVE_CREATE_EVENT]: this.executeApproveCreateEvent,
      [TransactionType.BET]: this.executeBet,
      [TransactionType.APPROVE_SET_RESULT]: this.executeApproveSetResult,
      [TransactionType.SET_RESULT]: this.executeSetResult,
      [TransactionType.APPROVE_VOTE]: this.executeApproveVote,
      [TransactionType.VOTE]: this.executeVote,
      [TransactionType.FINALIZE_RESULT]: this.executeFinalizeResult,
      [TransactionType.WITHDRAW]: this.executeWithdraw,
      [TransactionType.WITHDRAW_ESCROW]: this.executeWithdraw,
    };
    await confirmFunc[tx.type](index, tx);
  }

  /**
   * Logic to execute after a tx has been executed.
   * @param {number} index Index of the tx that was executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  onTxExecuted = (index, tx) => {
    // Refresh detail page if one the same page
    if (tx.topicAddress && tx.topicAddress === this.app.eventPage.topicAddress) {
      this.app.eventPage.queryTransactions(tx.topicAddress);
    }
    this.app.pendingTxsSnackbar.init();
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
  executeApprove = async (tx) => {
    const { senderAddress, topicAddress, amountSatoshi } = tx;
    const bodhiToken = getContracts().BodhiToken;
    const contract = this.app.global.qweb3.Contract(bodhiToken.address, bodhiToken.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('approve', {
      methodArgs: [topicAddress, amountSatoshi],
      senderAddress,
    });
    return { txid, gasLimit, gasPrice };
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
    this.showConfirmDialog();
  }

  /**
   * Executes an approve for a create event.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveCreateEvent = async (index, tx) => {
    const { txid, gasLimit, gasPrice } = await this.executeApprove(tx);

    // Create pending tx on server
    if (txid) {
      await createTransaction({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress: tx.senderAddress,
        name: tx.name,
        options: tx.options,
        resultSetterAddress: tx.resultSetterAddress,
        bettingStartTime: tx.bettingStartTime,
        bettingEndTime: tx.bettingEndTime,
        resultSettingStartTime: tx.resultSettingStartTime,
        resultSettingEndTime: tx.resultSettingEndTime,
        amount: tx.amountSatoshi,
      });

      this.addPendingApprove(txid);
      this.onTxExecuted(index, tx);
      Tracking.track('event-approveCreateEvent');
    }
  }

  /**
   * Adds a bet tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {Option} option Option obj that is being bet on.
   * @param {string} amount Amount of the bet.
   */
  @action
  addBetTx = async (topicAddress, oracleAddress, option, amount) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.BET,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx: option.idx,
      amount,
      token: Token.QTUM,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes a bet.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeBet = async (index, tx) => {
    const { topicAddress, oracleAddress, optionIdx, amount, senderAddress } = tx;
    const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().CentralizedOracle.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('bet', {
      methodArgs: [optionIdx],
      amount,
      senderAddress,
    });

    if (txid) {
      // Create pending tx on server
      await createBetTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amount,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-bet');
    }
  }

  /**
   * Adds an approve set result tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {Option} option Option of the result being set.
   * @param {string} amountSatoshi Approve amount.
   */
  @action
  addApproveSetResultTx = async (topicAddress, oracleAddress, option, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_SET_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx: option.idx,
      amount: amountSatoshi,
      token: Token.BOT,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes an approve for a set result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveSetResult = async (index, tx) => {
    const { txid, gasLimit, gasPrice } = await this.executeApprove(tx);

    // Create pending tx on server
    if (txid) {
      await createApproveSetResultTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress: tx.senderAddress,
        topicAddress: tx.topicAddress,
        oracleAddress: tx.oracleAddress,
        optionIdx: tx.optionIdx,
        amount: tx.amountSatoshi,
      });

      this.addPendingApprove(txid);
      this.onTxExecuted(index, tx);
      Tracking.track('event-approveSetResult');
    }
  }

  /**
   * Adds a set result tx to the queue.
   * @param {string} approveTxid Txid of the approve.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {Option} option Option of the result being set.
   * @param {string} amount Consensus threshold.
   */
  @action
  addSetResultTx = async (approveTxid, topicAddress, oracleAddress, optionIdx, amount) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.SET_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount,
      token: Token.BOT,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes a set result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeSetResult = async (index, tx) => {
    const { senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi } = tx;
    const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().CentralizedOracle.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('setResult', {
      methodArgs: [optionIdx],
      gasLimit: 1500000,
      senderAddress,
    });

    // Create pending tx on server
    if (txid) {
      await createSetResultTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amount: amountSatoshi,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-setResult');
    }
  }

  /**
   * Adds a approve vote tx to the queue.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   * @param {Option} option Option to vote on.
   * @param {string} amountSatoshi Approve amount.
   */
  @action
  addApproveVoteTx = async (topicAddress, oracleAddress, option, amountSatoshi) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_VOTE,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx: option.idx,
      amount: amountSatoshi,
      token: Token.BOT,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes an approve for a vote.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeApproveVote = async (index, tx) => {
    const { txid, gasLimit, gasPrice } = await this.executeApprove(tx);

    // Create pending tx on server
    if (txid) {
      await createApproveVoteTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress: tx.senderAddress,
        topicAddress: tx.topicAddress,
        oracleAddress: tx.oracleAddress,
        optionIdx: tx.optionIdx,
        amount: tx.amountSatoshi,
      });

      this.addPendingApprove(txid);
      this.onTxExecuted(index, tx);
      Tracking.track('event-approveVote');
    }
  }

  /**
   * Adds a vote tx to the queue.
   * @param {string} approveTxid Txid of the approve.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the DecentralizedOracle.
   * @param {Option} option Option to vote on.
   * @param {string} amount Vote amount.
   */
  @action
  addVoteTx = async (approveTxid, topicAddress, oracleAddress, optionIdx, amount) => {
    this.transactions.push(observable.object(new Transaction({
      approveTxid,
      type: TransactionType.VOTE,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx,
      amount,
      token: Token.BOT,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes a vote.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeVote = async (index, tx) => {
    const { senderAddress, topicAddress, oracleAddress, optionIdx, amountSatoshi } = tx;
    const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().DecentralizedOracle.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('voteResult', {
      methodArgs: [optionIdx, amountSatoshi],
      gasLimit: 1500000, // TODO: determine gas limit to use
      senderAddress,
    });

    // Create pending tx on server
    if (txid) {
      await createVoteTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amount: amountSatoshi,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-vote');
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
    this.showConfirmDialog();
  }

  /**
   * Executes a finalize result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeFinalizeResult = async (index, tx) => {
    const { senderAddress, topicAddress, oracleAddress } = tx;
    const contract = this.app.global.qweb3.Contract(oracleAddress, getContracts().DecentralizedOracle.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('finalizeResult', {
      methodArgs: [],
      senderAddress,
    });

    if (txid) {
      // Create pending tx on server
      await createFinalizeResultTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
        oracleAddress,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-finalizeResult');
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
    this.showConfirmDialog();
  }

  /**
   * Executes a withdraw or withdraw escrow..
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeWithdraw = async (index, tx) => {
    const { type, senderAddress, topicAddress } = tx;
    const contract = this.app.global.qweb3.Contract(topicAddress, getContracts().TopicEvent.abi);
    const methodName = type === TransactionType.WITHDRAW ? 'withdrawWinnings' : 'withdrawEscrow';
    const { txid, args: { gasLimit, gasPrice } } = await contract.send(methodName, {
      methodArgs: [],
      senderAddress,
    });

    if (txid) {
      // Create pending tx on server
      await createWithdrawTx({
        type,
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-withdraw');
    }
  }
}
