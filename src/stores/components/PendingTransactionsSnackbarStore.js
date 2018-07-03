import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';
import { TransactionType, TransactionStatus } from 'constants';

import Transaction from '../models/Transaction';
import { queryAllTransactions } from '../../network/graphQuery';


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

export default class PendingTransactionsSnackbarStore {
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

  constructor() {
    reaction(
      () => this.count,
      () => this.isVisible = this.count > 0
    );
  }

  @action
  init = async () => {
    this.reset();
    await this.queryPendingTransactions();
  }

  @action
  queryPendingTransactions = async () => {
    try {
      const filters = [{ status: TransactionStatus.Pending }];
      const result = await queryAllTransactions(filters);
      const txs = _.map(result, (tx) => new Transaction(tx));

      runInAction(() => {
        this.count = txs.length;
        this.pendingCreateEvents = _.filter(
          txs,
          (tx) => tx.type === TransactionType.ApproveCreateEvent || tx.type === TransactionType.CreateEvent
        );
        this.pendingBets = _.filter(txs, { type: TransactionType.Bet });
        this.pendingSetResults = _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveSetResult || tx.type === TransactionType.SetResult);
        this.pendingVotes = _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveVote || tx.type === TransactionType.Vote);
        this.pendingFinalizeResults = _.filter(txs, { type: TransactionType.FinalizeResult });
        this.pendingWithdraws = _.filter(txs, (tx) =>
          tx.type === TransactionType.Withdraw || tx.type === TransactionType.WithdrawEscrow);
        this.pendingTransfers = _.filter(txs, { type: TransactionType.Transfer });
        this.pendingResetApproves = _.filter(txs, { type: TransactionType.ResetApprove });
      });
    } catch (error) {
      console.error(error); // eslint-disable-line

      runInAction(() => {
        this.reset();
      });
    }
  }

  reset = () => Object.assign(this, INIT_VALUES)
}
