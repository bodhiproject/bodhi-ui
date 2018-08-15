import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';
import { TransactionType, TransactionStatus } from 'constants';
import { Transaction } from 'models';

import { queryAllTransactions } from '../../network/graphql/queries';


const INIT_VALUES = {
  isVisible: false,
  count: 0,
  pendingCreateEvents: 0,
  pendingBets: 0,
  pendingSetResults: 0,
  pendingVotes: 0,
  pendingFinalizeResults: 0,
  pendingWithdraws: 0,
  pendingTransfers: 0,
  pendingResetApproves: 0,
};

export default class PendingTxsSnackbarStore {
  @observable isVisible = INIT_VALUES.isVisible
  @observable count = INIT_VALUES.count

  pendingCreateEvents = INIT_VALUES.pendingCreateEvents
  pendingBets = INIT_VALUES.pendingBets
  pendingSetResults = INIT_VALUES.pendingSetResults
  pendingVotes = INIT_VALUES.pendingVotes
  pendingFinalizeResults = INIT_VALUES.pendingFinalizeResults
  pendingWithdraws = INIT_VALUES.pendingWithdraws
  pendingTransfers = INIT_VALUES.pendingTransfers
  pendingResetApproves = INIT_VALUES.pendingResetApproves

  constructor(app) {
    this.app = app;

    // Hide/show the snackbar when the pending count changes
    reaction(
      () => this.count,
      () => this.isVisible = this.count > 0
    );
    // Query pending txs on new blocks
    reaction(
      () => this.app.global.syncBlockNum,
      () => {
        if (this.app.global.syncPercent >= 100) {
          this.queryPendingTransactions();
        }
      },
    );

    this.init();
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    await this.queryPendingTransactions();
  }

  @action
  queryPendingTransactions = async () => {
    try {
      const filters = [{ status: TransactionStatus.PENDING }];
      const result = await queryAllTransactions(filters);
      const txs = _.map(result, (tx) => new Transaction(tx));

      runInAction(() => {
        this.count = txs.length;
        this.pendingCreateEvents = _.filter(
          txs,
          (tx) => tx.type === TransactionType.APPROVE_CREATE_EVENT || tx.type === TransactionType.CREATE_EVENT
        );
        this.pendingBets = _.filter(txs, { type: TransactionType.BET });
        this.pendingSetResults = _.filter(txs, (tx) =>
          tx.type === TransactionType.APPROVE_SET_RESULT || tx.type === TransactionType.SET_RESULT);
        this.pendingVotes = _.filter(txs, (tx) =>
          tx.type === TransactionType.APPROVE_VOTE || tx.type === TransactionType.VOTE);
        this.pendingFinalizeResults = _.filter(txs, { type: TransactionType.FINALIZE_RESULT });
        this.pendingWithdraws = _.filter(txs, (tx) =>
          tx.type === TransactionType.WITHDRAW || tx.type === TransactionType.WITHDRAW_ESCROW);
        this.pendingTransfers = _.filter(txs, { type: TransactionType.TRANSFER });
        this.pendingResetApproves = _.filter(txs, { type: TransactionType.RESET_APPROVE });
      });
    } catch (error) {
      console.error(error); // eslint-disable-line

      runInAction(() => {
        Object.assign(this, INIT_VALUES);
      });
    }
  }

  reset = () => Object.assign(this, INIT_VALUES)
}
