import { observable, action, reaction, runInAction } from 'mobx';
import { filter } from 'lodash';
import { TransactionStatus, Routes } from 'constants';
import { transactions } from '../../../network/graphql/queries';

const EVENT_HISTORY_LIMIT = 5;
const ACTIVITY_HISTORY_LIMIT = 10;
const INIT_VALUES = {
  transactions: [],
  skip: 0, // skip for transaction
  loaded: false,
  loadingMore: false,
  hasMore: true,
  eventSkip: 0, // skip when query events
  betSkip: 0,
  resultSetSkip: 0,
  withdrawSkip: 0,
  limit: 0,
};

export default class {
  @observable transactions = INIT_VALUES.transactions; // Full txs list fetched by batches
  @observable loadingMore = INIT_VALUES.loadingMore;
  @observable loaded = INIT_VALUES.loaded;
  @observable hasMore = INIT_VALUES.hasMore;
  limit = INIT_VALUES.limit;
  skip = INIT_VALUES.skip;
  eventSkip = INIT_VALUES.eventSkip;
  betSkip = INIT_VALUES.betSkip;
  resultSetSkip = INIT_VALUES.resultSetSkip;
  withdrawSkip = INIT_VALUES.withdrawSkip;

  constructor(app) {
    this.app = app;

    // Wallet addresses changed
    reaction(
      () => this.app.naka.account,
      () => {
        if (this.app.ui.location === Routes.ACTIVITY_HISTORY) {
          this.init();
        }
      }
    );
    // New block
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        if (this.transactions.length > 0 && this.app.ui.location === Routes.ACTIVITY_HISTORY) {
          const { naka: { account } } = this.app;
          const filters = { transactorAddress: account };
          const newTxs = await this.fetchHistory(filters, ACTIVITY_HISTORY_LIMIT, 0, 0, 0, 0, 0, true);
          const old = this.transactions[0];
          if (newTxs.length > 0 && (newTxs[0].txid !== old.txid
            || newTxs[0].txStatus !== old.txStatus)) {
            this.transactions.splice(0, 1, newTxs[0]);
          }
        }
      },
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    const { ui: { location }, eventPage: { event } } = this.app;
    let filters;
    if (location === Routes.ACTIVITY_HISTORY) {
      const { naka: { account } } = this.app;
      filters = { transactorAddress: account };
      this.limit = ACTIVITY_HISTORY_LIMIT;
    } else if (location === Routes.EVENT) {
      const address = event && event.address;
      if (!address) return;
      filters = { eventAddress: address };
      this.limit = EVENT_HISTORY_LIMIT;
    } else {
      return;
    }
    await this.loadFirst(filters);
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
  loadFirst = async (filters) => {
    this.transactions = await this.fetchHistory(filters);

    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Queries another batches of txs and appends it to the full list.
   */
  @action
  loadMoreTransactions = async () => {
    if (this.hasMore) {
      const { ui: { location }, naka: { account }, eventPage: { event } } = this.app;
      let filters;
      if (location === Routes.ACTIVITY_HISTORY) {
        filters = { transactorAddress: account };
      } else if (location === Routes.EVENT) {
        const address = event && event.address;
        if (!address) return;
        filters = { eventAddress: address };
      } else {
        return;
      }
      this.loadingMore = true;
      this.skip += this.limit;
      try {
        const moreTxs = await this.fetchHistory(filters);
        runInAction(() => {
          this.transactions = [...this.transactions, ...moreTxs];
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  /**
   * Gets the tx history via API call.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchHistory = async (filters, limit = this.limit, skip = this.skip,
    eventSkip = this.eventSkip, betSkip = this.betSkip,
    resultSetSkip = this.resultSetSkip, withdrawSkip = this.withdrawSkip, fetchBeginning = false) => {
    // Address is required for the request filters
    if (this.hasMore || fetchBeginning) {
      const { graphqlClient } = this.app;

      const skips = { eventSkip, betSkip, resultSetSkip, withdrawSkip };
      const res = await transactions(graphqlClient, { filter: filters, limit, skip, skips });

      const { items, pageInfo } = res;
      const pending = filter(items, { txStatus: TransactionStatus.PENDING });
      const confirmed = filter(items, { txStatus: TransactionStatus.SUCCESS });

      if (pageInfo && !fetchBeginning) {
        this.hasMore = pageInfo.hasNextPage;
        this.eventSkip = pageInfo.nextSkips.nextEventSkip;
        this.betSkip = pageInfo.nextSkips.nextBetSkip;
        this.resultSetSkip = pageInfo.nextSkips.nextResultSetSkip;
        this.withdrawSkip = pageInfo.nextSkips.nextWithdrawSkip;
      } else if (!pageInfo) this.hasMore = false;

      return [...pending, ...confirmed];
    }
    return INIT_VALUES.transactions;
  }
}
