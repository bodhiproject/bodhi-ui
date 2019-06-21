import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { Routes, SortBy } from 'constants';
import { withdrawableEvents } from '../../../network/graphql/queries';

const INIT_VALUES = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => toJS(this.app.naka.account),
      () => {
        if (this.app.ui.location === Routes.WITHDRAW) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.WITHDRAW && this.app.global.online) {
          if (this.loadingMore) this.loadMore();
          else this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    this.app.ui.location = Routes.WITHDRAW; // change ui location, for tabs to render correctly
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
      this.skip += this.limit; // pump the skip eg. from 0 to 24
      try {
        const nextFewEvents = await this.fetch(this.limit, this.skip);
        runInAction(() => {
          this.list = [...this.list, ...nextFewEvents]; // push to existing list
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  fetch = async (limit = this.limit, skip = this.skip) => {
    if (this.hasMore) {
      const {
        graphqlClient,
        naka: { account },
      } = this.app;

      if (!account) return INIT_VALUES.list;

      const orderBy = { field: 'arbitrationEndTime', direction: SortBy.DESCENDING };
      const filter = { withdrawerAddress: account, versions: [5, 6] };
      const res = await withdrawableEvents(graphqlClient, { filter, orderBy, limit, skip, roundBetsAddress: account, includeRoundBets: true });
      if (res.pageInfo) this.hasMore = res.pageInfo.hasNextPage;
      else this.hasMore = false;
      return res.items;
    }
    return INIT_VALUES.list;
  }
}
