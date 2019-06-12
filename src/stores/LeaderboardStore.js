import { observable, action, reaction, runInAction } from 'mobx';
import { filter, uniqBy } from 'lodash';
import { TransactionStatus, Routes, SortBy, TransactionType } from 'constants';
import { mostBets, allStats } from '../network/graphql/queries';
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
  limit: 0,
  skip: 0,
  hasMore: true,
};

export default class {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantCount = INIT_VALUES.participantCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardBets = INIT_VALUES.leaderboardBets
  @observable activeStep = INIT_VALUES.activeStep
  limit = INIT_VALUES.limit;
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
    reaction(
      () => this.activeStep,
      () => this.loadLeaderboard(),
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);

    const { ui: { location } } = this.app;

    if (location === Routes.LEADERBOARD) {
      this.limit = GLOBAL_LEADERBOARD_LIMIT;
      const res = await allStats(this.app.graphqlClient);
      Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
      await this.loadFirstLeaderboard();
    } else if (location === Routes.EVENT) {
      this.limit = EVENT_DETAIL_LEADERBOARD_LIMIT;
    } else if (location === Routes.EVENT_LEADERBOARD) {
      this.limit = EVENT_LEADERBOARD_LIMIT;
    }
    await this.loadFirstLeaderboard();
  }

  /**
   * Load the first 10 or 5 txs depending on the location
   */
  @action
  loadFirstLeaderboard = async () => {
    this.leaderboardBets = await this.fetchLeaderboard();

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
  fetchLeaderboard = async (limit = this.limit, skip = this.skip) => {
    // Address is required for the request filters
    if (this.hasMore) {
      const { graphqlClient } = this.app;

      const res = await mostBets(graphqlClient, { limit, skip });

      const { items, pageInfo } = res;

      if (pageInfo) {
        this.hasMore = pageInfo.hasNextPage;
      } else if (!pageInfo) this.hasMore = false;

      return items;
    }
    return INIT_VALUES.leaderboardBets;
  }
}
