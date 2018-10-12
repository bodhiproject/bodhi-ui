import { observable, action, reaction, runInAction, toJS } from 'mobx';
import { orderBy, omit, values, isEmpty, each, merge } from 'lodash';
import { TransactionType, SortBy, Routes } from 'constants';

import { getDetailPagePath } from '../../../helpers/utility';
import { queryAllTransactions, queryAllOracles } from '../../../network/graphql/queries';

const QUERY_LIMIT = 500;
const INIT_VALUES = {
  transactions: [],
  displayedTxs: [],
  tableOrder: SortBy.DESCENDING.toLowerCase(),
  tableOrderBy: 'createdTime',
  tablePerPage: 10,
  tablePage: 0,
  querySkip: 0,
  queryPage: 0,
  loaded: false,
};

export default class {
  @observable transactions = INIT_VALUES.transactions; // Full txs list fetched by batches
  @observable displayedTxs = INIT_VALUES.displayedTxs; // Txs for the current table page, sliced from transactions
  @observable tableOrder = INIT_VALUES.tableOrder; // UI table order
  @observable tableOrderBy = INIT_VALUES.tableOrderBy; // UI table order by
  @observable tablePerPage = INIT_VALUES.tablePerPage; // UI table per page
  @observable tablePage = INIT_VALUES.tablePage; // UI table page
  querySkip = INIT_VALUES.querySkip; // Tx query skip
  queryPage = INIT_VALUES.queryPage; // Tx query page
  @observable loaded = INIT_VALUES.loaded;

  constructor(app) {
    this.app = app;

    // Sort order changed
    reaction(
      () => this.tableOrder + this.tableOrderBy,
      () => {
        this.transactions = orderBy(this.transactions, [this.tableOrderBy], [this.tableOrder]);
        this.setDisplayedTxs();
      },
    );
    // Page or per page changed
    reaction(
      () => this.tablePage + this.tablePerPage,
      () => {
        this.setDisplayedTxs();

        // Fetch more batches if needed
        const txCount = this.transactions.length;
        const lastPage = Math.ceil(txCount / this.tablePerPage);
        if (txCount > 0 && this.tablePage + 1 === lastPage && lastPage * this.tablePerPage === txCount) {
          this.loadMore();
        }
      }
    );
    // New block
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        if (this.transactions.length > 0) {
          const txs = await this.fetchHistory((this.queryPage + 1) * QUERY_LIMIT, 0);
          this.transactions = orderBy(txs, [this.tableOrderBy], [this.tableOrder]);
          this.setDisplayedTxs();
        }
      },
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
    const start = this.tablePage === 0 ? 0 : this.tablePage * this.tablePerPage;
    const end = (this.tablePage * this.tablePerPage) + this.tablePerPage;
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
    this.transactions = orderBy(txs, [this.tableOrderBy], [this.tableOrder]);
    this.setDisplayedTxs();

    runInAction(() => {
      this.batches = 1;
      this.loaded = true;
    });
  }

  /**
   * Queries another batches of txs and appends it to the full list.
   */
  @action
  loadMore = async () => {
    this.querySkip += QUERY_LIMIT;
    const moreTxs = await this.fetchHistory();
    this.transactions = [...this.transactions, ...moreTxs];
    this.transactions = orderBy(this.transactions, [this.tableOrderBy], [this.tableOrder]);
    this.setDisplayedTxs();
  }

  /**
   * Gets the tx history via API call.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchHistory = async (limit = QUERY_LIMIT, skip = this.querySkip) => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return [];
    }

    const txTypes = values(omit(TransactionType, 'TRANSFER'));
    const filters = [];
    each(this.app.wallet.addresses, (walletAddress) => {
      merge(filters, txTypes.map(field => ({ type: field, senderAddress: walletAddress.address })));
    });
    return queryAllTransactions(filters, { field: 'createdTime', direction: SortBy.DESCENDING }, limit, skip);
  }

  /**
   * Changes the orderBy and order.
   * @param {string} columnName Field name of the column.
   */
  @action
  sort = (columnName) => {
    const [ascending, descending] = [SortBy.ASCENDING.toLowerCase(), SortBy.DESCENDING.toLowerCase()];
    this.tableOrderBy = columnName;
    this.tableOrder = this.tableOrder === descending ? ascending : descending;
  }

  /**
   * Queries and finds the newest Oracle to direct to for the purposes of clicking on the event name.
   * @param {string} topicAddress Topic address for the Oracle.
   * @return {string} URL path for the newest Oracle.
   */
  @action
  getOracleAddress = async (topicAddress) => {
    if (topicAddress) {
      const filters = [{ topicAddress }];
      const order = { field: 'endTime', direction: SortBy.DESCENDING };
      const { oracles } = await queryAllOracles(this.app, filters, order);
      const path = getDetailPagePath(oracles);
      if (path) return path;
    }
  }
}
