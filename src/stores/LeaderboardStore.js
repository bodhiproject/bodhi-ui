import { observable, action, reaction, runInAction } from 'mobx';
import { uniqBy, isEmpty } from 'lodash';
import { TransactionStatus, Routes, SortBy, TransactionType } from 'constants';
import { mostBets, allStats, biggestWinners } from '../network/graphql/queries';
import { satoshiToDecimal } from '../helpers/utility';

const EVENT_LEADERBOARD_LIMIT = 10;
const EVENT_DETAIL_LEADERBOARD_LIMIT = 5;
const GLOBAL_LEADERBOARD_LIMIT = 10;
const INIT_VALUES = {
  eventCount: 0,
  participantCount: 0,
  totalBets: '',
  leaderboardBets: [],
  activeStep: 0,
  leaderboardLimit: 0,
  skip: 0,
  hasMore: true,
};

export default class {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantCount = INIT_VALUES.participantCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardBets = INIT_VALUES.leaderboardBets
  @observable activeStep = INIT_VALUES.activeStep
  leaderboardLimit = INIT_VALUES.leaderboardLimit;
  skip = INIT_VALUES.skip;
  hasMore = INIT_VALUES.hasMore;

  constructor(app) {
    this.app = app;

    // // New block
    // reaction(
    //   () => this.app.global.syncBlockNum,
    //   async () => {
    //     if (!this.updating) await this.update();
    //   },
    // );
    reaction(
      () => this.app.naka.account + this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.LEADERBOARD
          || this.app.ui.location === Routes.EVENT
          || this.app.ui.location === Routes.EVENT_LEADERBOARD) {
          this.init();
        }
      }
    );
    // Leaderboard tab changed
    // reaction(
    //   () => this.activeStep,
    //   () => this.updateLeaderBoard(),
    // );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);

    const { ui: { location }, eventPage: { event } } = this.app;
    const address = event && event.address;

    let filters = {};
    if (location === Routes.LEADERBOARD) {
      this.leaderboardLimit = GLOBAL_LEADERBOARD_LIMIT;
      const res = await allStats(this.app.graphqlClient);
      Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
    } else if (location === Routes.EVENT) {
      this.leaderboardLimit = EVENT_DETAIL_LEADERBOARD_LIMIT;
      if (!address) return;

      filters = { eventAddress: address };
    } else if (location === Routes.EVENT_LEADERBOARD) {
      this.leaderboardLimit = EVENT_LEADERBOARD_LIMIT;
      if (!address) return;

      filters = { eventAddress: address };
    }
    await this.loadFirstLeaderboard(filters);
  }

  // @action
  // updateLeaderBoard = async () => {
  //   if (this.activeStep < 2) {
  //     await this.queryLeaderboard();
  //   } else {
  //     await this.queryBiggestWinner();
  //   }
  // }

  @action
  queryBiggestWinner = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const winners = await biggestWinners(this.app.graphqlClient, {
      filter: { eventAddress: address },
      limit: this.leaderboardLimit,
      skip: 0,
    });
    this.leaderboardBets = winners;
  }

  /**
   * Load the first 10 or 5 txs depending on the location
   */
  @action
  loadFirstLeaderboard = async (filters) => {
    this.leaderboardBets = await this.fetchLeaderboard(filters);

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
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  /**
   * Gets the leaderboard via API call.
   * @return {[MostBet]} leaderboard array of the query.
   */
  fetchLeaderboard = async (filters = {}, limit = this.leaderboardLimit, skip = this.skip) => {
    // Address is required for the request filters
    if (this.hasMore) {
      const { graphqlClient } = this.app;

      let res;
      if (isEmpty(filters)) {
        res = await mostBets(graphqlClient, { limit, skip });
      } else {
        res = await mostBets(graphqlClient, { filter: filters, limit, skip });
      }

      const { items, pageInfo } = res;

      if (pageInfo) {
        this.hasMore = pageInfo.hasNextPage;
      } else if (!pageInfo) this.hasMore = false;

      return items;
    }
    return INIT_VALUES.leaderboardBets;
  }
}
