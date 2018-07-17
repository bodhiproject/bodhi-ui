import { observable, action, reaction } from 'mobx';
import { Routes, SortBy, TransactionType } from 'constants';
import { queryAllTransactions } from '../../network/graphQuery';
import Transaction from '../models/Transaction';

const INIT_VALUES = {
  transactions: [],
  order: SortBy.DESCENDING,
  orderBy: 'createdTime',
  perPage: 10,
  page: 0,
  limit: 50,
  skip: 0,
  expanded: [],
};

export default class {
  @observable transactions = INIT_VALUES.transactions
  @observable order = INIT_VALUES.order
  @observable orderBy = INIT_VALUES.orderBy
  @observable perPage = INIT_VALUES.perPage
  @observable page = INIT_VALUES.page
  @observable limit = INIT_VALUES.limit
  @observable skip = INIT_VALUES.skip
  @observable expanded = INIT_VALUES.expanded

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.ACTIVITY_HISTORY) {
          this.fetch();
        }
      }
    );
  }

  @action.bound
  async init() {
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.ACTIVITY_HISTORY;
    this.transactions = await this.fetch();
  }

  @action.bound
  async fetch() {
    const direction = (this.order === SortBy.DESCENDING) ? SortBy.DESCENDING : SortBy.ASCENDING;
    const filter = [
      { type: TransactionType.APPROVE_CREATE_EVENT },
      { type: TransactionType.APPROVE_CREATE_EVENT },
      { type: TransactionType.BET },
      { type: TransactionType.APPROVE_SET_RESULT },
      { type: TransactionType.SET_RESULT },
      { type: TransactionType.APPROVE_VOTE },
      { type: TransactionType.VOTE },
      { type: TransactionType.FINALIZE_RESULT },
      { type: TransactionType.WITHDRAW },
      { type: TransactionType.WITHDRAW_ESCROW },
      { type: TransactionType.RESET_APPROVE },
    ];
    const transactions = await queryAllTransactions(filter, { field: this.orderBy, direction }, this.limit, this.skip);
    return transactions.map((tx) => new Transaction(tx, this.app));
  }
}
