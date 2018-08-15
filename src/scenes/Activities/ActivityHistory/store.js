import { observable, action, reaction, computed } from 'mobx';
import _ from 'lodash';
import { TransactionType, SortBy, Routes } from 'constants';
import { Transaction, Oracle } from 'models';

import { getDetailPagePath } from '../../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../../network/graphql/queries';

const INIT_VALUES = {
  transactions: [],
  order: SortBy.DESCENDING.toLowerCase(),
  orderBy: 'createdTime',
  perPage: 10,
  page: 0,
  limit: 50,
};

export default class {
  @observable transactions = INIT_VALUES.transactions
  @observable order = INIT_VALUES.order
  @observable orderBy = INIT_VALUES.orderBy
  @observable perPage = INIT_VALUES.perPage
  @observable page = INIT_VALUES.page
  @observable limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction( // Try to fetch more when need more data OR got new block
      () => this.app.global.syncBlockNum,
      () => this.getMoreData()
    );
    reaction( // Sort while order changes - may be different from the reaction with syncBlockNum in future
      () => this.order + this.orderBy,
      () => this.transactions = _.orderBy(this.transactions, [this.orderBy], [this.order])
    );
    reaction( // Try to fetch more when need more data OR got new block
      () => this.page + this.perPage,
      () => {
        // Set skip to fetch more txs if last page is reached
        const needMoreFetch = (this.perPage * (this.page + 1)) >= this.transactions.length;
        if (needMoreFetch) {
          this.limit = this.perPage;
          this.getMoreData();
        }
      }
    );
  }

  @action
  getMoreData = async () => {
    const moreData = await this.fetchHistory(this.transactions.length);
    this.transactions = [...this.transactions, ...moreData];
    this.transactions = _.orderBy(this.transactions, [this.orderBy], [this.order]);
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

  fetchHistory = async (skip = 0, limit = this.limit, orderBy = 'createdTime', order = SortBy.DESCENDING.toLowerCase()) => {
    // order default by DESC
    const direction = order === SortBy.ASCENDING.toLowerCase() ? SortBy.ASCENDING : SortBy.DESCENDING;
    const filters = _.values(_.omit(TransactionType, 'TRANSFER')).map(field => ({ type: field }));
    const orderBySect = { field: orderBy, direction };
    const result = await queryAllTransactions(filters, orderBySect, limit, skip);
    return _.map(result, (tx) => new Transaction(tx));
  }

  @action
  sort = (columnName) => {
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    this.orderBy = columnName;
    this.order = this.order === descending ? ascending : descending;
  }
}
