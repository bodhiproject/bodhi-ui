import { observable, action, reaction, computed, runInAction, toJS } from 'mobx';
import { orderBy, omit, values, isEmpty, each, merge } from 'lodash';
import { TransactionType, SortBy, Routes } from 'constants';

import { getDetailPagePath } from '../../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../../network/graphql/queries';

const INIT_VALUES = {
  transactions: [],
  currentPageTxs: [],
  order: SortBy.DESCENDING.toLowerCase(),
  orderBy: 'createdTime',
  perPage: 10,
  page: 0,
  limit: 50,
  loaded: false,
};

export default class {
  @observable transactions = INIT_VALUES.transactions;
  @observable currentPageTxs = INIT_VALUES.currentPageTxs; // Txs for the current table page, sliced from transactions
  @observable order = INIT_VALUES.order;
  @observable orderBy = INIT_VALUES.orderBy;
  @observable perPage = INIT_VALUES.perPage; // UI per page for the table (not the tx query)
  @observable page = INIT_VALUES.page; // UI current page (not for tx query)
  @observable limit = INIT_VALUES.limit;
  @observable loaded = INIT_VALUES.loaded;

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
      () => this.loadMore()
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
          this.loadMore();
        }
      }
    );
    // Wallet addresses changed
    reaction(
      () => toJS(this.app.wallet.addresses),
      () => this.loadFirst(),
    );
  }

  @action
  init = async () => {
    this.app.ui.location = Routes.ACTIVITY_HISTORY;
    await this.loadFirst();
  }

  /**
   * It is necessary to fetch a big batch of txs for the purposes of pagination. We need to know the total count
   * of all the txs for the table footer. This implementation goes like this:
   * 1. Fetch big batch of txs (500)
   * 2. Slice the txs per page (based on how many perPage is selected)
   * 3. If there are more than the first batch of txs (> 500), then fetch the second batch when the user is on the last
   *    page of the first batch.
   */
  @action
  loadFirst = async () => {
    Object.assign(this, INIT_VALUES);
    this.transactions = await this.fetchHistory(0, 500);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    this.loaded = false;
    const moreData = await this.fetchHistory(this.transactions.length);
    this.transactions = [...this.transactions, ...moreData];
    this.transactions = orderBy(this.transactions, [this.orderBy], [this.order]);
    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Gets the tx history via API call.
   * @param {number} skip Number of items to skip (pagination).
   * @param {number} limit Number of items per page.
   * @param {string} orderByField Field to order the table by.
   * @param {string} order Direction of the order by field.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchHistory = async (skip = 0, limit = this.limit, orderByField = this.orderBy, order = this.order) => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return [];
    }

    const txTypes = values(omit(TransactionType, 'TRANSFER'));
    const filters = [];
    each(this.app.wallet.addresses, (walletAddress) => {
      merge(filters, txTypes.map(field => ({ type: field, senderAddress: walletAddress.address })));
    });

    const direction = order === SortBy.ASCENDING.toLowerCase() ? SortBy.ASCENDING : SortBy.DESCENDING;
    const orderBySect = { field: orderByField, direction };
    return queryAllTransactions(filters, orderBySect, limit, skip);
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
      const targetOracle = await queryAllOracles(this.app, filters, order);
      const path = getDetailPagePath(targetOracle);
      if (path) return path;
    }
  }
}
