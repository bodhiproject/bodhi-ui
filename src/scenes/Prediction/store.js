import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { SortBy, EVENT_STATUS, Routes } from 'constants';

import { events } from '../../network/graphql/queries';

const INIT_VALUES = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
  sortBy: SortBy.ASCENDING,
};

export default class PredictionStore {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  @observable sortBy = INIT_VALUES.sortBy
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.sortBy + toJS(this.app.wallet.addresses) + this.app.refreshing.status,
      () => {
        if (this.app.ui.location === Routes.PREDICTION) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.PREDICTION && this.app.global.online) {
          if (this.loadingMore) this.loadMore();
          else this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    this.app.ui.location = Routes.PREDICTION;
    await this.loadFirst();
  }

  @action
  loadFirst = async () => {
    this.hasMore = true;
    this.list = await this.fetch(this.limit, 0);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit;
      try {
        const nextFewEvents = await this.fetch(this.limit, this.skip);
        runInAction(() => {
          this.list = [...this.list, ...nextFewEvents];
          this.loadingMore = false;
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  async fetch(limit = this.limit, skip = this.skip) {
    if (this.hasMore) {
      const {
        graphqlClient,
        naka: { account },
        global: { eventVersion },
        ui: { currentTimeUnix },
      } = this.app;

      const filter = { OR: [
        { status: EVENT_STATUS.PRE_BETTING, version: eventVersion },
        { status: EVENT_STATUS.BETTING, version: eventVersion },
        { status: EVENT_STATUS.CREATED, version: eventVersion },
      ] };
      const orderBy = { field: 'betEndTime', direction: this.sortBy };
      const res = await events(graphqlClient, {
        filter,
        orderBy,
        limit,
        skip,
        pendingTxsAddress: account,
        includeRoundBets: true,
        roundBetsAddress: account,
      });

      if (res.pageInfo) this.hasMore = res.pageInfo.hasNextPage;
      else this.hasMore = false;
      return res.items.filter(item => item.betEndTime > currentTimeUnix); // TODO: delete filter after server add pre-resultset status
    }
    return INIT_VALUES.list;
  }
}
