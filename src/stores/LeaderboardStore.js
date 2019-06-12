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
  leaderboardWinners: [],
  leaderboardDisplay: [],
  activeStep: 0,
  leaderboardLimit: 0,
  skip: 0,
  hasMore: true,
  winnerSkip: 0,
  winnerHasMore: true,
  loadingMore: false,
};

export default class {
  @observable eventCount = INIT_VALUES.eventCount
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable participantCount = INIT_VALUES.participantCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardDisplay = INIT_VALUES.leaderboardDisplay
  @observable leaderboardBets = INIT_VALUES.leaderboardBets
  @observable activeStep = INIT_VALUES.activeStep
  leaderboardLimit = INIT_VALUES.leaderboardLimit;
  skip = INIT_VALUES.skip;
  hasMore = INIT_VALUES.hasMore;
  // for biggest winners
  @observable leaderboardWinners = INIT_VALUES.leaderboardWinners
  winnerSkip = INIT_VALUES.winnerSkip;
  winnerHasMore = INIT_VALUES.winnerHasMore;

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
    reaction(
      () => this.activeStep,
      () => {
        if (this.activeStep < 1) {
          this.leaderboardDisplay = this.leaderboardBets;
        } else {
          this.leaderboardDisplay = this.leaderboardWinners;
        }
      }
    );
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
    await this.loadFirstLeaderboardBets(filters);
    await this.loadFirstBiggestWinners(filters);
    this.leaderboardDisplay = this.leaderboardBets;
  }

  @action
  loadFirstBiggestWinners = async (filters) => {
    this.leaderboardWinners = await this.fetchLeaderboardWinners(filters);

    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Load the first 10 or 5 txs depending on the location
   */
  @action
  loadFirstLeaderboardBets = async (filters) => {
    this.leaderboardBets = await this.fetchLeaderboardBets(filters);

    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Queries another batches of txs and appends it to the full list.
   */
  @action
  loadMoreLeaderboardBets = async () => {
    if (this.hasMore && this.leaderboardBets.length > 0) {
      const { ui: { location }, naka: { account }, eventPage: { event } } = this.app;
      const address = event && event.address;
      let filters = {};

      if (location === Routes.EVENT || location === Routes.EVENT_LEADERBOARD) {
        if (!address) return;

        filters = { eventAddress: address };
      }

      this.loadingMore = true;
      this.skip += this.leaderboardLimit;

      try {
        const moreBets = await this.fetchLeaderboardBets(filters);

        runInAction(() => {
          this.leaderboardBets = [...this.leaderboardBets, ...moreBets];
          this.leaderboardDisplay = this.leaderboardBets;
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.skip -= this.leaderboardLimit;
      }
    }
  }

  /**
   * Gets the leaderboard bets via API call.
   * @return {[MostBet]} leaderboard array of the query.
   */
  fetchLeaderboardBets = async (filters = {}, limit = this.leaderboardLimit, skip = this.skip) => {
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

  /**
   * Gets the leaderboard winners via API call.
   * @return {[BiggestWinner]} leaderboard array of the query.
   */
  fetchLeaderboardWinners = async (filters = {}, limit = this.leaderboardLimit, skip = this.winnerSkip) => {
    // Address is required for the request filters
    if (this.winnerHasMore && !isEmpty(filters)) {
      const { graphqlClient } = this.app;

      const res = await biggestWinners(graphqlClient, { filter: filters, limit, skip });

      // const { items, pageInfo } = res;

      // if (pageInfo) {
      //   this.winnerHasMore = pageInfo.hasNextPage;
      // } else if (!pageInfo) this.winnerHasMore = false;

      return res;
    }
    return INIT_VALUES.leaderboardWinners;
  }
}
