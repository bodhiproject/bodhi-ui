import { observable, action, reaction, runInAction } from 'mobx';
import { filter, uniqBy } from 'lodash';
import logger from 'loglevel';
import { TransactionStatus, Routes, SortBy, TransactionType } from 'constants';
import { transactions, resultSets, pendingTransactions } from '../network/graphql/queries';

const EVENT_HISTORY_LIMIT = 10;
const EVENT_DETAIL_HISTORY_LIMIT = 5;
const ACTIVITY_HISTORY_LIMIT = 10;
const INIT_VALUES = {
  transactions: [],
  myTransactions: [],
  resultSetsHistory: [],
  skip: 0, // skip for transaction
  mySkip: 0,
  resultSkip: 0,
  loaded: false,
  loadingMore: false,
  hasMore: true,
  resultHasMore: true,
  myHasMore: true,
  eventSkip: 0, // skip when query events
  myEventSkip: 0,
  betSkip: 0,
  myBetSkip: 0,
  resultSetSkip: 0,
  myResultSetSkip: 0,
  withdrawSkip: 0,
  myWithdrawSkip: 0,
  limit: 0,
  updating: false,
  prevTxLen: 0,
  pendingTransactions: [],
};
const HISTORY_TYPES = {
  ALL_TRANSACTIONS: 0,
  MY_TRANSACTIONS: 1,
  RESULT_SET_HISTORY: 2,
};

export default class {
  limit = INIT_VALUES.limit;
  updating = INIT_VALUES.updating;
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
  @observable myHasMore = INIT_VALUES.myHasMore;
  @observable mySkip = INIT_VALUES.mySkip;
  myEventSkip = INIT_VALUES.myEventSkip;
  myBetSkip = INIT_VALUES.myBetSkip;
  myResultSetSkip = INIT_VALUES.myResultSetSkip;
  myWithdrawSkip = INIT_VALUES.myWithdrawSkip;
  // for result history in event page
  @observable resultSetsHistory = INIT_VALUES.resultSetsHistory;
  @observable resultHasMore = INIT_VALUES.resultHasMore;
  @observable resultSkip = INIT_VALUES.resultSkip;

  prevTxLen = INIT_VALUES.prevTxLen;
  @observable pendingTransactions = INIT_VALUES.pendingTransactions;

  constructor(app) {
    this.app = app;

    // Wallet addresses changed
    reaction(
      () => this.app.naka.account,
      () => {
        if (this.app.ui.location === Routes.ACTIVITY_HISTORY || this.app.ui.location === Routes.EVENT || this.app.ui.location === Routes.EVENT_HISTORY) {
          this.init();
        }
      }
    );
    // New block
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        const { ui: { toggleHistoryNeedUpdate, ifHistoryNeedUpdate } } = this.app;
        if (!this.updating && ifHistoryNeedUpdate) {
          await this.update();
          if (this.pendingTransactions.length === 0) {
            toggleHistoryNeedUpdate();
          }
        }
      },
    );
  }

  // update skips so when loading more so that duplicate txs won't appear
  updateSkips = (tx, type) => {
    switch (tx.txType) {
      case TransactionType.CREATE_EVENT: {
        if (type === HISTORY_TYPES.ALL_TRANSACTIONS) {
          this.eventSkip += 1;
          this.skip += 1;
        } else if (type === HISTORY_TYPES.MY_TRANSACTIONS) {
          this.myEventSkip += 1;
          this.mySkip += 1;
        }
        return;
      }
      case TransactionType.BET: {
        if (type === HISTORY_TYPES.ALL_TRANSACTIONS) {
          this.betSkip += 1;
          this.skip += 1;
        } else if (type === HISTORY_TYPES.MY_TRANSACTIONS) {
          this.myBetSkip += 1;
          this.mySkip += 1;
        }
        return;
      }
      case TransactionType.VOTE: {
        if (type === HISTORY_TYPES.ALL_TRANSACTIONS) {
          this.betSkip += 1;
          this.skip += 1;
        } else if (type === HISTORY_TYPES.MY_TRANSACTIONS) {
          this.myBetSkip += 1;
          this.mySkip += 1;
        }
        return;
      }
      case TransactionType.RESULT_SET: {
        if (type === HISTORY_TYPES.ALL_TRANSACTIONS) {
          this.resultSetSkip += 1;
          this.skip += 1;
        } else if (type === HISTORY_TYPES.MY_TRANSACTIONS) {
          this.myResultSetSkip += 1;
          this.mySkip += 1;
        } else if (type === HISTORY_TYPES.RESULT_SET_HISTORY) {
          this.resultSkip += 1;
        }
        return;
      }
      case TransactionType.WITHDRAW: {
        if (type === HISTORY_TYPES.ALL_TRANSACTIONS) {
          this.withdrawSkip += 1;
          this.skip += 1;
        } else if (type === HISTORY_TYPES.MY_TRANSACTIONS) {
          this.myWithdrawSkip += 1;
          this.mySkip += 1;
        }
        return;
      }
      default: {
        logger.error(`HistoryStore.updateSkips: Invalid txType: ${tx.txType}`);
      }
    }
  }

  updateTxs = (oldTxs, newTxs, type) => {
    const pendings = oldTxs.filter(tx => tx.txStatus === TransactionStatus.PENDING);
    // remove all pendings
    oldTxs = oldTxs.filter(tx => pendings.filter(pending => pending.txid === tx.txid).length === 0);
    // record txids for updating
    const pendingTxids = new Map();
    pendings.map(tx => pendingTxids.set(tx.txid, tx));
    const oldTxids = new Map();
    oldTxs.map(tx => oldTxids.set(tx.txid, tx));
    // search through newTxs
    let confirmedAddOns = [];
    let pendingAddOns = [];
    const addOnTxids = new Map();
    newTxs.forEach(tx => {
      addOnTxids.set(tx.txid, tx);
      if (pendingTxids.has(tx.txid)) {
        if (tx.txStatus === TransactionStatus.PENDING) pendingAddOns = [...pendingAddOns, tx];
        else if (tx.txStatus === TransactionStatus.SUCCESS) {
          confirmedAddOns = [...confirmedAddOns, tx];
          this.updateSkips(tx, type);
        }
      } else {
        // new tx or old txs already has it
        confirmedAddOns = [...confirmedAddOns, tx];
        if (!oldTxids.has(tx.txid)) {
          // new tx
          this.updateSkips(tx, type);
        }
      }
    });
    // add back existing txs
    oldTxs.forEach(tx => {
      if (!addOnTxids.has(tx.txid)) {
        confirmedAddOns = [...confirmedAddOns, tx];
      }
    });

    return [...pendingAddOns, ...confirmedAddOns];
  }

  @action
  update = async () => {
    const { ui: { location }, eventPage: { event }, naka: { account } } = this.app;
    const address = event ? event.address : undefined;
    this.updating = true;
    if (location === Routes.ACTIVITY_HISTORY) {
      if (!account) {
        this.updating = false;
        return;
      }
      const filters = { transactorAddress: account };
      const newTxs = await this.fetchHistory(filters, this.limit, 0, 0, 0, 0, 0, true);
      this.pendingTransactions = await this.fetchPendingHistory(filters);
      this.transactions = this.updateTxs(this.transactions, newTxs, HISTORY_TYPES.ALL_TRANSACTIONS);
    } else if (location === Routes.EVENT || location === Routes.EVENT_HISTORY) {
      if (!address) {
        this.updating = false;
        return;
      }

      const filters = { eventAddress: address }; // for all txs
      let newTxs = await this.fetchHistory(filters, this.limit, 0, 0, 0, 0, 0, true);
      this.pendingTransactions = await this.fetchPendingHistory({ eventAddress: address, transactorAddress: account });
      this.transactions = this.updateTxs(this.transactions, newTxs, HISTORY_TYPES.ALL_TRANSACTIONS);

      newTxs = await this.fetchMyHistory(this.limit, 0, 0, 0, 0, 0, true); // for my txs
      this.myTransactions = this.updateTxs(this.myTransactions, newTxs, HISTORY_TYPES.MY_TRANSACTIONS);
      // load result history
      newTxs = await this.fetchResultHistory(this.limit, 0, true);
      this.resultSetsHistory = this.updateTxs(this.resultSetsHistory, newTxs, HISTORY_TYPES.RESULT_SET_HISTORY);
    }
    this.transactions = [...this.pendingTransactions, ...this.transactions];
    this.updating = false;
  }

  @action
  setPrevTxLength = () => this.prevTxLen = this.transactions.length;

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);

    const { ui: { location }, eventPage: { event }, naka: { account } } = this.app;
    const address = event ? event.address : undefined;

    if (location === Routes.ACTIVITY_HISTORY) {
      this.limit = ACTIVITY_HISTORY_LIMIT;
      if (!account) {
        this.loaded = true;
        return;
      }
      const filters = { transactorAddress: account };
      await this.loadFirstTransactions(filters);
      this.pendingTransactions = await this.fetchPendingHistory(filters);
      this.setPrevTxLength();
    } else if (location === Routes.EVENT) {
      if (!address) return;

      this.limit = EVENT_DETAIL_HISTORY_LIMIT;
      await this.loadFirstTransactions({ eventAddress: address }); // for all txs
      this.pendingTransactions = await this.fetchPendingHistory({ eventAddress: address, transactorAddress: account });
      this.myTransactions = await this.fetchMyHistory(); // for my txs

      // load result history
      this.resultSetsHistory = await this.fetchResultHistory();
    } else if (location === Routes.EVENT_HISTORY) {
      if (!address) return;

      this.limit = EVENT_HISTORY_LIMIT;
      await this.loadFirstTransactions({ eventAddress: address }); // for all txs
      this.pendingTransactions = await this.fetchPendingHistory({ eventAddress: address, transactorAddress: account });
      this.myTransactions = await this.fetchMyHistory(); // for my txs

      // load result history
      this.resultSetsHistory = await this.fetchResultHistory();
    }
    this.transactions = [...this.pendingTransactions, ...this.transactions];
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
      } else if (location === Routes.EVENT || location === Routes.EVENT_HISTORY) {
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
          this.transactions = uniqBy(this.transactions, 'txid');
          this.loadingMore = false; // stop showing the loading icon
          this.setPrevTxLength();
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
          this.myTransactions = uniqBy(this.myTransactions, 'txid');
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
          this.resultSetsHistory = uniqBy(this.resultSetsHistory, 'txid');
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
    resultSetSkip = this.resultSetSkip, withdrawSkip = this.withdrawSkip, updating = false) => {
    // Address is required for the request filters
    if (this.hasMore || this.updating) {
      const { graphqlClient } = this.app;

      const transactionSkips = { eventSkip, betSkip, resultSetSkip, withdrawSkip };

      const res = await transactions(graphqlClient, { filter: filters, limit, skip, transactionSkips });

      const { items, pageInfo } = res;
      const pending = filter(items, { txStatus: TransactionStatus.PENDING });
      const confirmed = filter(items, { txStatus: TransactionStatus.SUCCESS });

      if (pageInfo && !updating) {
        this.hasMore = pageInfo.hasNextPage;
        this.eventSkip = pageInfo.nextTransactionSkips.nextEventSkip;
        this.betSkip = pageInfo.nextTransactionSkips.nextBetSkip;
        this.resultSetSkip = pageInfo.nextTransactionSkips.nextResultSetSkip;
        this.withdrawSkip = pageInfo.nextTransactionSkips.nextWithdrawSkip;
      } else if (!pageInfo && !updating) this.hasMore = false;

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
    resultSetSkip = this.myResultSetSkip, withdrawSkip = this.myWithdrawSkip, updating = false) => {
    // Address is required for the request filters
    if (this.myHasMore || this.updating) {
      const { naka: { account }, eventPage: { event }, graphqlClient } = this.app;
      const address = event && event.address;

      if (!address || !account) return INIT_VALUES.myTransactions;

      const filters = { eventAddress: address, transactorAddress: account };

      const transactionSkips = { eventSkip, betSkip, resultSetSkip, withdrawSkip };

      const res = await transactions(graphqlClient, { filter: filters, limit, skip, transactionSkips });

      const { items, pageInfo } = res;
      const pending = filter(items, { txStatus: TransactionStatus.PENDING });
      const confirmed = filter(items, { txStatus: TransactionStatus.SUCCESS });

      if (pageInfo && !updating) {
        this.myHasMore = pageInfo.hasNextPage;
        this.myEventSkip = pageInfo.nextTransactionSkips.nextEventSkip;
        this.myBetSkip = pageInfo.nextTransactionSkips.nextBetSkip;
        this.myResultSetSkip = pageInfo.nextTransactionSkips.nextResultSetSkip;
        this.myWithdrawSkip = pageInfo.nextTransactionSkips.nextWithdrawSkip;
      } else if (!pageInfo && !updating) this.myHasMore = false;

      return [...pending, ...confirmed];
    }
    return INIT_VALUES.myTransactions;
  }

  /**
   * Gets event result history via API call.
   * @return {[ResultSets]} Tx array of the query.
   */
  fetchResultHistory = async (limit = this.limit, skip = this.resultSkip, updating = false) => {
    // Address is required for the request filters
    if (this.resultHasMore || this.updating) {
      const { eventPage: { event }, graphqlClient } = this.app;
      const address = event && event.address;

      if (!address) return INIT_VALUES.resultSetsHistory;

      const res = await resultSets(graphqlClient, {
        filter: { eventAddress: address, txStatus: TransactionStatus.SUCCESS },
        orderBy: { field: 'eventRound', direction: SortBy.DESCENDING },
        limit,
        skip,
      });

      const { items, pageInfo } = res;

      if (pageInfo && !updating) {
        this.resultHasMore = pageInfo.hasNextPage;
      } else if (!pageInfo && !updating) this.resultHasMore = false;

      return items;
    }
    return INIT_VALUES.resultSetsHistory;
  }

  /**
   * Gets the pending tx history via API call.
   * @return {[Transaction]} Tx array of the query.
   */
  fetchPendingHistory = async (filters) => {
    if (!filters.transactorAddress) return INIT_VALUES.pendingTransactions;
    const { graphqlClient } = this.app;

    const res = await pendingTransactions(graphqlClient, { filter: filters });

    return res;
  }
}
