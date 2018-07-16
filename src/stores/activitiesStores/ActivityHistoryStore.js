import { observable, action, reaction, computed } from 'mobx';
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
      async () => this.transactions = await this.fetchHistory()
    );
    reaction( // Sort while order changes
      () => this.order + this.orderBy,
      async () => this.transactions = await this.fetchHistory()
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

  @computed
  get displayedTxs() {
    const start = this.page * this.perPage;
    const end = (this.page * this.perPage) + this.perPage;
    return this.transactions.slice(start, end);
  }

  @action
  getOracleAddress = async (topicAddress) => {
    const orderBy = { field: 'endTime', direction: SortBy.DESCENDING };
    const filters = [{ topicAddress }];

    if (topicAddress) {
      const targetoracle = await queryAllOracles(filters, orderBy);
      const path = getDetailPagePath(_.map(targetoracle, (oracle) => new Oracle(oracle, this.app)));
      if (path) return path;
    }
  }

  @action
  init = async () => {
    // reset to initial values
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.ACTIVITY_HISTORY;
    this.transactions = await this.fetchHistory();
  }

  fetchHistory = async (orderBy = this.orderBy, order = this.order, limit = this.limit, skip = this.skip) => {
    const direction = order === SortBy.DESCENDING.toLowerCase() ? SortBy.DESCENDING : SortBy.ASCENDING;
    const filters = _.values(_.omit(TransactionType, 'TRANSFER')).map(field => ({ type: field }));
    const orderBySect = { field: orderBy, direction };
    const result = await queryAllTransactions(filters, orderBySect, limit, skip);
    return _.map(result, (tx) => new Transaction(tx));
  }

  @action
  sort = (columnName) => {
    /*
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    if (this.orderBy !== columnName) {
      this.order = descending;
    } else {
      this.order = this.order === descending ? ascending : descending;
    }
    this.orderBy = columnName;
    */
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    this.orderBy = columnName;
    this.order = this.order === descending ? ascending : descending;
  }
}
