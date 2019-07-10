import { observable, action, reaction, runInAction } from 'mobx';
import { isEmpty } from 'lodash';
import { Routes, SortBy } from 'constants';
import { allStats, eventLeaderboardEntries, globalLeaderboardEntries } from '../network/graphql/queries';
import { satoshiToDecimal } from '../helpers/utility';

const EVENT_LEADERBOARD_LIMIT = 10;
const EVENT_DETAIL_LEADERBOARD_LIMIT = 5;
const GLOBAL_LEADERBOARD_LIMIT = 15;
const INIT_VALUES = {
  eventCount: 0,
  participantCount: 0,
  totalBets: '',
  leaderboardBets: [],
  leaderboardWinners: [],
  leaderboardDisplay: [],
  leaderboardReturnRatio: [],
  activeStep: 0,
  leaderboardLimit: 0,
  skip: 0,
  hasMore: true,
  winnerSkip: 0,
  winnerHasMore: true,
  loadingMore: false,
  diaplayHasMore: true,
  loading: false,
  returnRatioSkip: 0,
  returnRatioHasMore: true,
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
  @observable hasMore = INIT_VALUES.hasMore;
  // for biggest winners
  @observable leaderboardWinners = INIT_VALUES.leaderboardWinners
  winnerSkip = INIT_VALUES.winnerSkip;
  @observable winnerHasMore = INIT_VALUES.winnerHasMore;
  // for return ratio
  returnRatioSkip = INIT_VALUES.returnRatioSkip;
  @observable returnRatioHasMore = INIT_VALUES.returnRatioHasMore;
  @observable leaderboardReturnRatio = INIT_VALUES.leaderboardReturnRatio;

  @observable diaplayHasMore = INIT_VALUES.diaplayHasMore;
  loading = INIT_VALUES.loading;

  constructor(app) {
    this.app = app;

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
          this.diaplayHasMore = this.hasMore;
        } else if (this.app.ui.location === Routes.LEADERBOARD) {
          this.leaderboardDisplay = this.leaderboardReturnRatio;
          this.diaplayHasMore = this.returnRatioHasMore;
        } else {
          this.leaderboardDisplay = this.leaderboardWinners;
          this.diaplayHasMore = this.winnerHasMore;
        }
      }
    );
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        if (!this.loading && this.app.history.pendingTransactions.length !== 0) {
          await this.loadFirst();
        }
      },
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);

    await this.loadFirst();
  }

  @action
  loadFirst = async () => {
    this.loading = true;
    const { ui: { location }, eventPage: { event } } = this.app;
    const address = event && event.address;

    let filters = {};
    if (location === Routes.LEADERBOARD) {
      this.leaderboardLimit = GLOBAL_LEADERBOARD_LIMIT;
      const res = await allStats(this.app.graphqlClient);
      Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
      await this.loadFirstLeaderboardBets();
      await this.loadFirstLeaderboardReturnRatio();
    } else if (location === Routes.EVENT) {
      this.leaderboardLimit = EVENT_DETAIL_LEADERBOARD_LIMIT;
      if (!address) return;

      filters = { eventAddress: address };
      await this.loadFirstLeaderboardBets(filters);
      await this.loadFirstBiggestWinners(filters);
    } else if (location === Routes.EVENT_LEADERBOARD) {
      this.leaderboardLimit = EVENT_LEADERBOARD_LIMIT;
      if (!address) return;

      filters = { eventAddress: address };
      await this.loadFirstLeaderboardBets(filters);
      await this.loadFirstBiggestWinners(filters);
    }
    this.loading = false;
    this.leaderboardDisplay = this.leaderboardBets;
    this.diaplayHasMore = this.hasMore;
    this.activeStep = 0;
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
   * Load the first 10 or 5 txs depending on the location
   */
  @action
  loadFirstLeaderboardReturnRatio = async () => {
    this.leaderboardReturnRatio = await this.fetchLeaderboardReturnRatio();

    runInAction(() => {
      this.loaded = true;
    });
  }

  /**
   * Queries another batches of leaderboard bets and appends it to the full list.
   */
  @action
  loadMoreLeaderboardBets = async () => {
    if (this.hasMore && this.leaderboardBets.length > 0) {
      const { ui: { location }, eventPage: { event } } = this.app;
      if (location === Routes.EVENT) return;
      const address = event && event.address;
      let filters = {};

      if (location === Routes.EVENT_LEADERBOARD) {
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
   * Queries another batches of leaderboard winners and appends it to the full list.
   */
  @action
  loadMoreLeaderboardBiggestWinners = async () => {
    if (this.winnerHasMore && this.leaderboardWinners.length > 0) {
      const { ui: { location }, eventPage: { event } } = this.app;
      if (location === Routes.EVENT) return;
      const address = event && event.address;
      let filters = {};

      if (location === Routes.EVENT_LEADERBOARD) {
        if (!address) return;

        filters = { eventAddress: address };
      } else {
        return;
      }

      this.loadingMore = true;
      this.winnerSkip += this.leaderboardLimit;

      try {
        const moreWinners = await this.fetchLeaderboardWinners(filters);

        runInAction(() => {
          this.leaderboardWinners = [...this.leaderboardWinners, ...moreWinners];
          this.leaderboardDisplay = this.leaderboardWinners;
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.winnerSkip -= this.leaderboardLimit;
      }
    }
  }

  /**
   * Gets the leaderboard bets via API call.
   * @return {[LeaderboardEntries]} leaderboard array of the query.
   */
  fetchLeaderboardBets = async (filters = {}, limit = this.leaderboardLimit, skip = this.skip) => {
    const { graphqlClient } = this.app;
    const orderBy = { field: 'investments', direction: SortBy.DESCENDING };
    let res;
    if (isEmpty(filters)) {
      res = await globalLeaderboardEntries(graphqlClient, { orderBy, limit, skip });
    } else {
      res = await eventLeaderboardEntries(graphqlClient, { filter: filters, orderBy, limit, skip });
    }

    const { items, pageInfo } = res;

    if (pageInfo) {
      this.hasMore = pageInfo.hasNextPage;
    } else if (!pageInfo) this.hasMore = false;

    return items;
  }

  /**
   * Gets the leaderboard winners via API call.
   * @return {[LeaderboardEntries]} leaderboard array of the query.
   */
  fetchLeaderboardWinners = async (filters = {}, limit = this.leaderboardLimit, skip = this.winnerSkip) => {
    // Address is required for the request filters
    if (!isEmpty(filters)) {
      const { graphqlClient } = this.app;
      const orderBy = { field: 'winnings', direction: SortBy.DESCENDING };
      const res = await eventLeaderboardEntries(graphqlClient, { filter: filters, orderBy, limit, skip });

      const { items, pageInfo } = res;

      if (pageInfo) {
        this.winnerHasMore = pageInfo.hasNextPage;
      } else if (!pageInfo) this.winnerHasMore = false;

      return items;
    }
    return INIT_VALUES.leaderboardWinners;
  }

  /**
   * Gets the leaderboard return ratio via API call.
   * @return {[LeaderboardEntries]} leaderboard array of the query.
   */
  fetchLeaderboardReturnRatio = async (limit = this.leaderboardLimit, skip = this.returnRatioSkip) => {
    const { graphqlClient } = this.app;
    const orderBy = { field: 'returnRatio', direction: SortBy.DESCENDING };
    const res = await globalLeaderboardEntries(graphqlClient, { orderBy, limit, skip });

    const { items, pageInfo } = res;

    if (pageInfo) {
      this.returnRatioHasMore = pageInfo.hasNextPage;
    } else if (!pageInfo) this.returnRatioHasMore = false;

    return items;
  }
}
