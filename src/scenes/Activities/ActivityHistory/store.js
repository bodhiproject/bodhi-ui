import { observable, action, reaction, computed } from 'mobx';
import { orderBy, omit, values, isEmpty, each, merge } from 'lodash';
import { TransactionType, SortBy, Routes } from 'constants';

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

  @computed
  get displayedTxs() {
    const start = this.page * this.perPage;
    const end = (this.page * this.perPage) + this.perPage;
    return this.transactions.slice(start, end);
  }

  constructor(app) {
    this.app = app;

    // Try to fetch more when got new block
    reaction(
      () => this.app.global.syncBlockNum,
      () => this.getMoreData()
    );
    // Sort while order changes - may be different from the reaction with syncBlockNum in future
    reaction(
      () => this.order + this.orderBy,
      () => this.transactions = orderBy(this.transactions, [this.orderBy], [this.order])
    );
    // Try to fetch more when need more data
    reaction(
      () => this.page + this.perPage,
      () => {
        // Set skip to fetch more txs if last page is reached, but no fetch if initial request hasn't been finished (i.e. txs length == 0)
        const needMoreFetch = this.transactions.length > 0 && (this.perPage * (this.page + 1)) >= this.transactions.length;
        if (needMoreFetch) {
          this.limit = this.perPage;
          this.getMoreData();
        }
      }
    );
  }

  @action
  init = async () => {
    // reset to initial values
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.ACTIVITY_HISTORY;
    this.transactions = await this.fetchHistory();
  }

  fetchHistory = async (skip = 0, limit = this.limit, orderByField = 'createdTime', order = SortBy.DESCENDING.toLowerCase()) => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return [];
    }

    const direction = order === SortBy.ASCENDING.toLowerCase() ? SortBy.ASCENDING : SortBy.DESCENDING;

    const txTypes = values(omit(TransactionType, 'TRANSFER'));
    const filters = [];
    each(this.app.wallet.addresses, (walletAddress) => {
      merge(filters, txTypes.map(field => ({ type: field, senderAddress: walletAddress.address })));
    });

    const orderBySect = { field: orderByField, direction };
    const result = await queryAllTransactions(filters, orderBySect, limit, skip);
    return result;
  }

  @action
  getMoreData = async () => {
    const moreData = await this.fetchHistory(this.transactions.length);
    this.transactions = [...this.transactions, ...moreData];
    this.transactions = orderBy(this.transactions, [this.orderBy], [this.order]);
  }

  @action
  sort = (columnName) => {
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    this.orderBy = columnName;
    this.order = this.order === descending ? ascending : descending;
  }

  @action
  getOracleAddress = async (topicAddress) => {
    const order = { field: 'endTime', direction: SortBy.DESCENDING };
    const filters = [{ topicAddress }];

    if (topicAddress) {
      const targetoracle = await queryAllOracles(this.app, filters, order);
      const path = getDetailPagePath(targetoracle);
      if (path) return path;
    }
  }
}
