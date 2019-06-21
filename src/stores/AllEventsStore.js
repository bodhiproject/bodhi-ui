import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { SortBy, Routes } from 'constants';
import { events } from '../network/graphql/queries';

const INIT_VALUES = {
  loaded: false, // INIT_VALUESial loaded state
  loadingMore: false, // for scroll laoding animation
  list: [], // data list
  hasMore: true,
  skip: 0, // skip
};


export default class {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  @observable limit = 24

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy + toJS(this.app.wallet.addresses) + this.app.refreshing,
      () => {
        if (this.app.ui.location === Routes.ALL_EVENTS) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.ALL_EVENTS && this.app.global.online) {
          if (this.loadingMore) this.loadMoreEvents();
          else this.init();
        }
      }
    );
  }

  @action
  init = async (limit = this.limit) => {
    Object.assign(this, INIT_VALUES); // reset all properties
    this.app.ui.location = Routes.ALL_EVENTS;
    this.list = await this.fetchAllEvents(limit);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMoreEvents = async () => {
    this.loadingMore = true;
    this.skip += this.limit;
    try {
      const nextFewEvents = await this.fetchAllEvents();
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents];
        this.loadingMore = false;
      });
    } catch (e) {
      // if encounter error, such as internet loss, keep loadingMore true, but set skip back, so when regain internet, loadMore continue
      this.skip -= this.limit;
    }
  }

  fetchAllEvents = async (limit = this.limit, skip = this.skip) => {
    if (this.hasMore) {
      const {
        graphqlClient,
        naka: { account },
      } = this.app;

      const filter = { versions: [5, 6] };

      const orderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
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
      return res.items;
    }
    return INIT_VALUES.list;
  }
}
