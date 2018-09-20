import { observable, action, runInAction, reaction } from 'mobx';
import axios from 'axios';
import { map, includes, isEmpty, remove, some, each } from 'lodash';
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
   * Checks for pending approve txs. If approve is successful, show the follow-up tx prompt.
   */
  checkPendingApproves = async () => {
    // Only show one tx confirm screen at a time
    if (this.visible) {
      return;
    }

    const pending = this.getPendingApproves();
    if (!isEmpty(pending)) {
      const txid = pending[0];
      let txs = await queryAllTransactions([{ txid }], undefined, 1);
      txs = map(txs, (tx) => new Transaction(tx));

      if (!isEmpty(txs)) {
        const { SUCCESS, FAIL } = TransactionStatus;
        const tx = txs[0];

        // Execute follow-up tx if successful approve
        if (tx.status === SUCCESS) {
          switch (tx.type) {
            case TransactionType.APPROVE_CREATE_EVENT: {
              break;
            }
            case TransactionType.APPROVE_SET_RESULT: {
              await this.showSetResultPrompt(tx.topicAddress, tx.oracleAddress, tx.optionIdx, tx.amount);
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

        // Remove the pending approve txid from storage
        if (some([SUCCESS, FAIL], tx.status)) this.removePendingApprove(txid);
      } else {
        // Couldn't find pending tx in DB, delete from localStorage
        this.removePendingApprove(txid);
      }
    }
  }

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

  onTxCreated = () => {
    this.app.pendingTxsSnackbar.init();
    // TODO: refresh Event page if still in viewing that same page
  }

  @action
  showBetPrompt = async (topicAddress, oracleAddress, option, amount) => {
    const onConfirmed = async () => {
      // Execute bet
      const contract = this.app.global.qweb3.Contract(this.oracleAddress, getContracts().CentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('bet', {
        methodArgs: [this.option.idx],
        amount: this.amount,
        senderAddress: this.senderAddress,
      });

      // Create pending tx on server
      if (txid) {
        await createBetTx({
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress: this.senderAddress,
          topicAddress: this.topicAddress,
          oracleAddress: this.oracleAddress,
          optionIdx: this.option.idx,
          amount: this.amount,
          token: this.token,
          version: 0,
        });
        this.onTxCreated();
        Tracking.track('event-bet');
      }
    };
    this.transactions.push(observable.object(new Transaction({
      type: TransactionType.BET,
      senderAddress: this.app.wallet.currentAddress,
      topicAddress,
      oracleAddress,
      optionIdx: option.idx,
      amount,
      token: Token.QTUM,
      onConfirmed,
    })));

    this.showConfirmDialog();
  }

  @action
  showApproveSetResultPrompt = async (topicAddress, oracleAddress, option, amount) => {
    this.type = TransactionType.APPROVE_SET_RESULT;
    this.topicAddress = topicAddress;
    this.oracleAddress = oracleAddress;
    this.option = option;
    this.amount = decimalToSatoshi(amount);
    this.token = Token.BOT;
    this.senderAddress = this.app.wallet.currentAddress;
    this.confirmedFunc = async () => {
      // Execute approve
      const bodhiToken = getContracts().BodhiToken;
      const contract = this.app.global.qweb3.Contract(bodhiToken.address, bodhiToken.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('approve', {
        methodArgs: [this.topicAddress, this.amount],
        senderAddress: this.senderAddress,
      });

      // Create pending tx on server
      if (txid) {
        await createApproveSetResultTx({
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress: this.senderAddress,
          topicAddress: this.topicAddress,
          oracleAddress: this.oracleAddress,
          optionIdx: this.option.idx,
          amount: this.amount,
          token: this.token,
          version: 0,
        });
        this.addPendingApprove(txid);
        this.onTxCreated();
        Tracking.track('event-approveSetResult');
      }
    };
    this.showConfirmDialog();
  }

  @action
  showSetResultPrompt = async (topicAddress, oracleAddress, optionIdx, amount) => {
    this.type = TransactionType.SET_RESULT;
    this.topicAddress = topicAddress;
    this.oracleAddress = oracleAddress;
    this.option = { idx: optionIdx };
    this.amount = decimalToSatoshi(amount);
    this.token = Token.BOT;
    this.senderAddress = this.app.wallet.currentAddress;
    this.confirmedFunc = async () => {
      // Execute setResult
      const contract = this.app.global.qweb3.Contract(this.oracleAddress, getContracts().CentralizedOracle.abi);
      const { txid, args: { gasLimit, gasPrice } } = await contract.send('setResult', {
        methodArgs: [this.option.idx],
        gasLimit: 1500000,
        senderAddress: this.senderAddress,
      });

      // Create pending tx on server
      if (txid) {
        await createSetResultTx({
          txid,
          gasLimit: gasLimit.toString(),
          gasPrice: gasPrice.toFixed(8),
          senderAddress: this.senderAddress,
          topicAddress: this.topicAddress,
          oracleAddress: this.oracleAddress,
          optionIdx: this.option.idx,
          amount: this.amount,
          token: this.token,
          version: 0,
        });
        this.onTxCreated();
        Tracking.track('event-setResult');
      }
    };
    this.showConfirmDialog();
  }

  @action
  onTxConfirmed = async () => {
    await this.confirmedFunc();
    this.visible = false;
  }

  @action
  deleteTx = (index) => {
    this.transactions.splice(index, 1);
    if (this.transactions.length === 0) {
      this.visible = false;
    }
  }
}
