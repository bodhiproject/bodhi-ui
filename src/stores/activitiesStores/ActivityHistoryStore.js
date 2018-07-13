import { observable, action, reaction } from 'mobx';
import { TransactionType, SortBy, Routes } from 'constants';
import _ from 'lodash';

import { getDetailPagePath } from '../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../network/graphQuery';
import Transaction from '../models/Transaction';
import Oracle from '../models/Oracle';

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
      const path = getDetailPagePath(_.map(targetoracle, (oracle) => new Oracle(oracle, this.app)));
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
    const { APPROVE_CREATE_EVENT, CREATE_EVENT, BET, APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE, FINALIZE_RESULT, WITHDRAW, WITHDRAW_ESCROW, RESET_APPROVE } = TransactionType;
    const filters = [
      { type: APPROVE_CREATE_EVENT },
      { type: CREATE_EVENT },
      { type: BET },
      { type: APPROVE_SET_RESULT },
      { type: SET_RESULT },
      { type: APPROVE_VOTE },
      { type: VOTE },
      { type: FINALIZE_RESULT },
      { type: WITHDRAW },
      { type: WITHDRAW_ESCROW },
      { type: RESET_APPROVE },
    ];
    const orderBySect = { field: orderBy, direction };
    const result = await queryAllTransactions(filters, orderBySect, limit, skip);
    return _.map(result, (tx) => new Transaction(tx));
  }

  @action
  sortClick = (property) => {
    if (this.orderBy === property && this.order === SortBy.DESCENDING.toLowerCase()) {
      this.order = SortBy.ASCENDING.toLowerCase();
    } else {
      this.order = SortBy.DESCENDING.toLowerCase();
    }

    this.orderBy = property;
  }
}
