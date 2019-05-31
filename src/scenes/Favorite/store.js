import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { each } from 'lodash';
import { STORAGE_KEY } from '../../config/app';
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

export default class FavoriteStore {
  // Data example: ['0xf5594dad875cf361b3cf5a2e9662528bb96ea89c', ...]
  @observable favAddresses = JSON.parse(localStorage.getItem(STORAGE_KEY.FAVORITES)) || [];
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.global.online + this.app.wallet.addresses,
      () => {
        if (this.app.global.online && this.visible) this.init();
      }
    );
    reaction(
      () => this.favAddresses,
      () => {
        if (this.visible) this.init();
      },
    );
  }

  isFavorite = (eventAddress) => this.favAddresses.includes(eventAddress);

  @action
  setFavorite = async (eventAddress) => {
    if (!eventAddress) return;

    if (this.isFavorite(eventAddress)) {
      this.favAddresses = this.favAddresses.filter(x => x !== eventAddress);
    } else {
      this.favAddresses.push(eventAddress);
    }

    // Update localStorage
    localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify(this.favAddresses));
  }


  @action
  init = async () => {
    this.app.ui.location = Routes.FAVORITE;
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
    if (this.favAddresses.length === 0) {
      this.list = [];
      return;
    }
    if (this.hasMore) {
      const filters = [];
      each(this.favAddresses, (addr) => filters.push({ address: addr }));
      const res = await events(this.app.graphqlClient, {
        filter: { OR: filters },
        orderBy: [{ field: 'blockNum', direction: SortBy.DESCENDING }],
        limit,
        skip,
      });
      if (res.pageInfo) this.hasMore = res.pageInfo.hasNextPage;
      else this.hasMore = false;
      return res.items;
    }
    return INIT_VALUES.list;
  }
}
