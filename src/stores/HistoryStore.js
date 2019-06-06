import { observable, action, reaction, runInAction } from 'mobx';
import { filter } from 'lodash';
import { TransactionStatus, Routes, SortBy } from 'constants';
import { transactions, resultSets } from '../network/graphql/queries';

const EVENT_HISTORY_LIMIT = 5;
const ACTIVITY_HISTORY_LIMIT = 10;
const INIT_VALUES = {
  transactions: [],
  myTransactions: [],
  resultSetsHistory: [],
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
  limit = INIT_VALUES.limit;

  @observable transactions = INIT_VALUES.transactions;
  @observable loadingMore = INIT_VALUES.loadingMore;
  @observable loaded = INIT_VALUES.loaded;
  @observable hasMore = INIT_VALUES.hasMore;
  // for All Transaction in Event page and in Activity history page
  @observable skip = INIT_VALUES.skip;
  eventSkip = INIT_VALUES.eventSkip;
  betSkip = INIT_VALUES.betSkip;
  resultSetSkip = INIT_VALUES.resultSetSkip;
  withdrawSkip = INIT_VALUES.withdrawSkip;
  // for My Transaction in Event page
  @observable myTransactions = INIT_VALUES.myTransactions;
  @observable myHasMore = INIT_VALUES.hasMore;
  @observable mySkip = INIT_VALUES.skip;
  myEventSkip = INIT_VALUES.eventSkip;
  myBetSkip = INIT_VALUES.betSkip;
  myResultSetSkip = INIT_VALUES.resultSetSkip;
  myWithdrawSkip = INIT_VALUES.withdrawSkip;
  // for result history in event page
  @observable resultSetsHistory = INIT_VALUES.resultSetsHistory;
  @observable resultHasMore = INIT_VALUES.hasMore;
  @observable resultSkip = INIT_VALUES.skip;

  constructor(app) {
    this.app = app;

    // Wallet addresses changed
    reaction(
      () => this.app.naka.account,
      () => {
        if (this.app.ui.location === Routes.ACTIVITY_HISTORY || this.app.ui.location === Routes.EVENT) {
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

    const { ui: { location }, eventPage: { event }, naka: { account } } = this.app;
    const address = event ? event.address : undefined;

    if (location === Routes.ACTIVITY_HISTORY) {
      this.limit = ACTIVITY_HISTORY_LIMIT;
      await this.loadFirstTransactions({ transactorAddress: account });
    } else if (location === Routes.EVENT) {
      if (!address) return;

      this.limit = EVENT_HISTORY_LIMIT;
      await this.loadFirstTransactions({ eventAddress: address }); // for all txs

      this.myTransactions = await this.fetchMyHistory(); // for my txs

      // load result history
      this.resultSetsHistory = await this.fetchResultHistory();
    }
  }

  /**
   * Load the first 10 or 5 txs depending on the location
   */
  @action
  loadFirstTransactions = async (filters) => {
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
      const address = event && event.address;
      let filters;

      if (location === Routes.ACTIVITY_HISTORY) {
        filters = { transactorAddress: account };
      } else if (location === Routes.EVENT) {
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
   * Queries another batches of my txs and appends it to the full list.
   */
  @action
  loadMoreMyTransactions = async () => {
    if (this.myHasMore) {
      this.loadingMore = true;
      this.mySkip += this.limit;

      try {
        const moreTxs = await this.fetchMyHistory();

        runInAction(() => {
          this.myTransactions = [...this.myTransactions, ...moreTxs];
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.mySkip -= this.limit;
      }
    }
  }

  /**
   * Queries another batches of result history and appends it to the full list.
   */
  @action
  loadMoreResultHistory = async () => {
    if (this.resultHasMore) {
      this.loadingMore = true;
      this.resultSkip += this.limit;

      try {
        const moreTxs = await this.fetchResultHistory();

        runInAction(() => {
          this.resultSetsHistory = [...this.resultSetsHistory, ...moreTxs];
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.resultSkip -= this.limit;
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

      const transactionSkips = { eventSkip, betSkip, resultSetSkip, withdrawSkip };

      const res = await transactions(graphqlClient, { filter: filters, limit, skip, transactionSkips });

      const { items, pageInfo } = res;
      const pending = filter(items, { txStatus: TransactionStatus.PENDING });
      const confirmed = filter(items, { txStatus: TransactionStatus.SUCCESS });

      if (pageInfo && !fetchBeginning) {
        this.hasMore = pageInfo.hasNextPage;
        this.eventSkip = pageInfo.nextTransactionSkips.nextEventSkip;
        this.betSkip = pageInfo.nextTransactionSkips.nextBetSkip;
        this.resultSetSkip = pageInfo.nextTransactionSkips.nextResultSetSkip;
        this.withdrawSkip = pageInfo.nextTransactionSkips.nextWithdrawSkip;
      } else if (!pageInfo) this.hasMore = false;

      return [...pending, ...confirmed];
    }
    return INIT_VALUES.transactions;
  }

  /**
   * Gets my tx history via API call.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchMyHistory = async (limit = this.limit, skip = this.mySkip,
    eventSkip = this.myEventSkip, betSkip = this.myBetSkip,
    resultSetSkip = this.myResultSetSkip, withdrawSkip = this.myWithdrawSkip) => {
    // Address is required for the request filters
    if (this.myHasMore) {
      const { naka: { account }, eventPage: { event }, graphqlClient } = this.app;
      const address = event && event.address;

      if (!address) return;

      const filters = { eventAddress: address, transactorAddress: account };

      const transactionSkips = { eventSkip, betSkip, resultSetSkip, withdrawSkip };

      const res = await transactions(graphqlClient, { filter: filters, limit, skip, transactionSkips });

      const { items, pageInfo } = res;
      const pending = filter(items, { txStatus: TransactionStatus.PENDING });
      const confirmed = filter(items, { txStatus: TransactionStatus.SUCCESS });

      if (pageInfo) {
        this.myHasMore = pageInfo.hasNextPage;
        this.myEventSkip = pageInfo.nextTransactionSkips.nextEventSkip;
        this.myBetSkip = pageInfo.nextTransactionSkips.nextBetSkip;
        this.myResultSetSkip = pageInfo.nextTransactionSkips.nextResultSetSkip;
        this.myWithdrawSkip = pageInfo.nextTransactionSkips.nextWithdrawSkip;
      } else if (!pageInfo) this.myHasMore = false;

      return [...pending, ...confirmed];
    }
    return INIT_VALUES.transactions;
  }

  /**
   * Gets event result history via API call.
   * @return {[ResultSets]} Tx array of the query.
   */
  fetchResultHistory = async (limit = this.limit, skip = this.resultSkip) => {
    // Address is required for the request filters
    if (this.resultHasMore) {
      const { eventPage: { event }, graphqlClient } = this.app;
      const address = event && event.address;

      if (!address) return;

      const res = await resultSets(this.app.graphqlClient, {
        filter: { eventAddress: address, txStatus: TransactionStatus.SUCCESS },
        orderBy: { field: 'eventRound', direction: SortBy.DESCENDING },
        limit,
        skip,
      });

      const { items, pageInfo } = res;

      if (pageInfo) {
        this.resultHasMore = pageInfo.hasNextPage;
      } else this.resultHasMore = false;

      return items;
    }
    return INIT_VALUES.transactions;
  }
}
