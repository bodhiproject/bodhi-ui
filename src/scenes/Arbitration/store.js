import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { EVENT_STATUS, Routes, SortBy } from '../../constants';
import { events } from '../../network/graphql/queries';

const INIT_VALUES = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class ArbitrationStore {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy + toJS(this.app.wallet.addresses),
      () => {
        if (this.app.ui.location === Routes.ARBITRATION) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.ARBITRATION && this.app.global.online) {
          if (this.loadingMore) this.loadMore();
          else this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    this.app.ui.location = Routes.ARBITRATION;
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
        const nextFewEvents = await this.fetch();
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
        ui: { locale },
        global: { eventVersion },
      } = this.app;

      const filter = { OR: [
        {
          status: EVENT_STATUS.ARBITRATION,
          version: eventVersion,
        },
        {
          status: EVENT_STATUS.ORACLE_RESULT_SETTING,
          version: eventVersion,
        },
      ] };
      const orderBy = { field: 'arbitrationEndTime', direction: SortBy.DESCENDING };
      const res = await events(graphqlClient, {
        filter,
        orderBy,
        limit,
        skip,
        pendingTxsAddress: account,
      });
      if (res.pageInfo) this.hasMore = res.pageInfo.hasNextPage;
      else this.hasMore = false;
      return res.items;
    }
    return INIT_VALUES.list;
  }
}
