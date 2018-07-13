import { observable, action, reaction } from 'mobx';
import { TransactionType, SortBy, Routes } from 'constants';

import { getDetailPagePath } from '../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../network/graphQuery';

const INIT_VALUES = {
  transactions: [],
  order: SortBy.DESCENDING.toLowerCase(),
  orderBy: 'createdTime',
  perPage: 10,
  page: 0,
  limit: 50,
  perLimit: 50,
  skip: 0,
};

export default class {
  @observable transactions = INIT_VALUES.transactions
  @observable order = INIT_VALUES.order
  @observable orderBy = INIT_VALUES.orderBy
  @observable perPage = INIT_VALUES.perPage
  @observable page = INIT_VALUES.page
  @observable skip = INIT_VALUES.skip
  @observable limit = INIT_VALUES.limit
  @observable perLimit = INIT_VALUES.perLimit
  txs = INIT_VALUES.transactions

  constructor(app) {
    this.app = app;
    reaction( // Update page on new block
      () => this.app.global.syncBlockNum,
      () => {
        this.init();
      }
    );
    reaction( // Sort while order changes
      () => this.order + this.orderBy,
      async () => {
        this.transactions = await this.fetchHistory();
      }
    );
    reaction( // Refresh when need more data
      () => this.page + this.perPage,
      async () => {
        // Set skip to fetch more txs if last page is reached - it seems to be ugly?
        if (Math.floor(this.transactions.length / this.perPage) - 1 === this.page) {
          const moreData = await this.fetchHistory(this.orderBy, this.order, this.perLimit, this.transactions.length);
          this.transactions = [...this.transactions, ...moreData];
          this.limit = this.transactions.length;
        }
      }
    );
  }

  @action
  oracleJump = async (topicAddress, history) => {
    const orderBy = { field: 'endTime', direction: SortBy.DESCENDING };
    const filters = [{ topicAddress }];

    if (topicAddress) {
      const targetoracle = await queryAllOracles(filters, orderBy);
      const path = getDetailPagePath(targetoracle);
      if (path) history.push(path);
    }
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.ACTIVITY_HISTORY;
    this.transactions = await this.fetchHistory();
  }

  @action
  fetchHistory = async (orderBy = this.orderBy, order = this.order, limit = this.limit, skip = this.skip) => {
    const direction = order === SortBy.DESCENDING.toLowerCase() ? SortBy.DESCENDING : SortBy.ASCENDING;
    const filters = [
      { type: TransactionType.APPROVE_CREATE_EVENT },
      { type: TransactionType.CREATE_EVENT },
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
    const orderBySect = { field: orderBy, direction };
    const txs = await queryAllTransactions(filters, orderBySect, limit, skip);
    return txs;
  }

  @action
  pageChange = (event, page) => { // eslint-disable-line
    this.page = page;
  }

  @action
  perPageChange = (event) => {
    this.perPage = event.target.value;
  }

  @action
  sortClick = (event, property) => { // eslint-disable-line

    if (this.orderBy === property && this.order === SortBy.DESCENDING.toLowerCase()) {
      this.order = SortBy.ASCENDING.toLowerCase();
    } else {
      this.order = SortBy.DESCENDING.toLowerCase();
    }

    this.orderBy = property;
  }
}
