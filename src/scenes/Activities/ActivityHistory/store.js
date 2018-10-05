import { observable, action, reaction, runInAction, toJS } from 'mobx';
import { orderBy, omit, values, isEmpty, each, merge } from 'lodash';
import { TransactionType, SortBy, Routes } from 'constants';

import { getDetailPagePath } from '../../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../../network/graphql/queries';

const QUERY_LIMIT = 10;
const INIT_VALUES = {
  transactions: [],
  displayedTxs: [],
  order: SortBy.DESCENDING.toLowerCase(),
  orderBy: 'createdTime',
  perPage: 5,
  page: 0,
  skip: 0,
  loaded: false,
};

export default class {
  @observable transactions = INIT_VALUES.transactions;
  @observable displayedTxs = INIT_VALUES.displayedTxs; // Txs for the current table page, sliced from transactions
  @observable order = INIT_VALUES.order;
  @observable orderBy = INIT_VALUES.orderBy;
  @observable perPage = INIT_VALUES.perPage; // UI per page for the table (not the tx query)
  @observable page = INIT_VALUES.page; // UI current page (not for tx query)
  @observable limit = QUERY_LIMIT; // Tx query limit
  @observable skip = INIT_VALUES.skip; // Tx query skip
  @observable loaded = INIT_VALUES.loaded;

  constructor(app) {
    this.app = app;

    // Try to fetch more when got new block
    // reaction(
    //   () => this.app.global.syncBlockNum,
    //   () => this.loadMore()
    // );
    // Sort order changed
    reaction(
      () => this.order + this.orderBy,
      () => {
        this.transactions = orderBy(this.transactions, [this.orderBy], [this.order]);
        this.setDisplayedTxs();
      },
    );
    // Page or per page changed
    reaction(
      () => this.page + this.perPage,
      () => {
        this.setDisplayedTxs();

        // Fetch more batches if needed
        const txCount = this.transactions.length;
        const lastPage = Math.ceil(txCount / this.perPage);
        if (txCount > 0 && this.page + 1 === lastPage && lastPage * this.perPage === txCount) {
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
   * Slices the current page of txs (out of the full tx list) based on the page and perPage.
   */
  @action
  setDisplayedTxs() {
    const start = this.page === 0 ? 0 : (this.page * this.perPage);
    const end = (this.page * this.perPage) + this.perPage;
    this.displayedTxs = this.transactions.slice(start, end);
  }

  /**
   * It is necessary to fetch a big batch of txs for the purposes of pagination. We need to know the total count
   * of all the txs for the table footer. This implementation goes like this:
   * 1. Fetch big batch of txs (500)
   * 2. Slice the txs per page (based on how many perPage is selected)
   * 3. If there are more than the first batch of txs (> 500), then fetch the second batch when the user is on the last
   *    page of the first batch. And so on for any further batches.
   */
  @action
  loadFirst = async () => {
    Object.assign(this, INIT_VALUES);
    const txs = await this.fetchHistory();
    this.transactions = orderBy(txs, [this.orderBy], [this.order]);
    this.setDisplayedTxs();

    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Queries another batches of txs and appends it to the full list.
   */
  @action
  loadMore = async () => {
    this.skip += QUERY_LIMIT;
    const moreTxs = await this.fetchHistory();
    this.transactions = [...this.transactions, ...moreTxs];
    this.transactions = orderBy(this.transactions, [this.orderBy], [this.order]);
    this.setDisplayedTxs();
  }

  /**
   * Gets the tx history via API call.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchHistory = async () => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return [];
    }

    const txTypes = values(omit(TransactionType, 'TRANSFER'));
    const filters = [];
    each(this.app.wallet.addresses, (walletAddress) => {
      merge(filters, txTypes.map(field => ({ type: field, senderAddress: walletAddress.address })));
    });
    return queryAllTransactions(filters, { field: 'createdTime', direction: SortBy.DESCENDING }, this.limit, this.skip);
  }

  /**
   * Changes the orderBy and order.
   * @param {string} columnName Field name of the column.
   */
  @action
  sort = (columnName) => {
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    this.orderBy = columnName;
    this.order = this.order === descending ? ascending : descending;
  }

  /**
   * Queries and finds the newest Oracle to direct to for the purposes of clicking on the event name.
   * @param {string} topicAddress Topic address for the Oracle.
   * @return {string} URL path for the newest Oracle.
   */
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
