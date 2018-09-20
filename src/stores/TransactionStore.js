import { observable, action, runInAction, reaction } from 'mobx';
import axios from 'axios';
import { map, includes, isEmpty, remove, some, each, reduce } from 'lodash';
import { WalletProvider, TransactionType, TransactionStatus, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';

import networkRoutes from '../network/routes';
import { queryAllTransactions } from '../network/graphql/queries';
import { createBetTx, createApproveSetResultTx, createSetResultTx } from '../network/graphql/mutations';
import getContracts from '../config/contracts';
import Tracking from '../helpers/mixpanelUtil';
import { decimalToSatoshi } from '../helpers/utility';

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
    const pending = this.getPendingApproves();
    if (includes(pending, txid)) remove(pending, txid);
    localStorage.setItem('pendingApproves', pending);
  };

  /**
   * Checks for successful approve txs. If they are successful, adds a tx to the list of txs to confirm.
   */
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
        const { SUCCESS, FAIL } = TransactionStatus;

        // Remove the pending approve txid from storage
        if (some([SUCCESS, FAIL], tx.status)) this.removePendingApprove(tx.txid);

        // Execute follow-up tx if successful approve
        if (tx.status === SUCCESS) {
          switch (tx.type) {
            case TransactionType.APPROVE_CREATE_EVENT: {
              break;
            }
            case TransactionType.APPROVE_SET_RESULT: {
              await this.addSetResultTx(tx.topicAddress, tx.oracleAddress, tx.optionIdx, tx.amount);
              break;
            }
            case TransactionType.APPROVE_VOTE: {
              break;
            }
            default: {
              break;
            }
          }
        }
      });
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
          amount: tx.amount,
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
    switch (tx.type) {
      case TransactionType.BET: {
        await this.executeBet(index, tx);
        break;
      }
      case TransactionType.APPROVE_SET_RESULT: {
        await this.executeApproveSetResult(index, tx);
        break;
      }
      case TransactionType.SET_RESULT: {
        await this.executeSetResult(index, tx);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Logic to execute after a tx has been executed.
   * @param {number} index Index of the tx that was executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  onTxExecuted = (index, tx) => {
    // Refresh detail page if one the same page
    if (tx.topicAddress && tx.topicAddress === this.app.eventPage.topicAddress) {
      this.app.eventPage.queryTransactions(this.app.eventPage.topicAddress);
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
    this.transactions.splice(index, 1);
    if (this.transactions.length === 0) {
      this.visible = false;
    }
  }

  /**
   * Shows the confirm dialog when trying to do a bet.
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
   * @param {number} index Index of the tx obj.
   * @param {Transaction} tx Bet tx obj.
   */
  @action
  executeBet = async (index, tx) => {
    const { topicAddress, oracleAddress, optionIdx, amount, token, senderAddress } = tx;
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
        token,
        version: 0,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-bet');
    }
  }

  /**
   * Shows the confirm dialog when trying to do a approve for a set result.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {Option} option Option of the result being set.
   * @param {string} amount Approve amount.
   */
  @action
  addApproveSetResultTx = async (topicAddress, oracleAddress, option, amount) => {
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.APPROVE_SET_RESULT,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx: option.idx,
      amount: decimalToSatoshi(amount),
      token: Token.BOT,
    })));
    this.showConfirmDialog();
  }

  /**
   * Executes an approve for a set result.
   * @param {number} index Index of the tx obj.
   * @param {Transaction} tx Transaction obj.
   */
  @action
  executeApproveSetResult = async (index, tx) => {
    const { senderAddress, topicAddress, oracleAddress, optionIdx, amount, token } = tx;
    const bodhiToken = getContracts().BodhiToken;
    const contract = this.app.global.qweb3.Contract(bodhiToken.address, bodhiToken.abi);
    const { txid, args: { gasLimit, gasPrice } } = await contract.send('approve', {
      methodArgs: [topicAddress, amount],
      senderAddress,
    });

    // Create pending tx on server
    if (txid) {
      await createApproveSetResultTx({
        txid,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toFixed(8),
        senderAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amount,
        token,
        version: 0,
      });

      this.addPendingApprove(txid);
      this.onTxExecuted(index, tx);
      Tracking.track('event-approveSetResult');
    }
  }

  /**
   * Shows the confirm dialog when trying to do a set result.
   * @param {string} topicAddress Address of the TopicEvent.
   * @param {string} oracleAddress Address of the CentralizedOracle.
   * @param {Option} option Option of the result being set.
   * @param {string} amount Consensus threshold.
   */
  @action
  addSetResultTx = async (topicAddress, oracleAddress, optionIdx, amount) => {
    this.transactions.push(observable.object(new Transaction({
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
   * @param {number} index Index of the tx obj.
   * @param {Transaction} tx Transaction obj.
   */
  @action
  executeSetResult = async (index, tx) => {
    const { senderAddress, topicAddress, oracleAddress, optionIdx, amount, token } = tx;
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
        amount,
        token,
        version: 0,
      });

      this.onTxExecuted(index, tx);
      Tracking.track('event-setResult');
    }
  }
}
