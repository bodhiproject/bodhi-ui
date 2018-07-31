import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { OracleStatus, Routes, SortBy } from 'constants';
import { queryAllTopics } from '../../network/graphQuery';
import Topic from '../models/Topic';

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
  @observable list = INIT_VALUES.list

  @observable hasMore = INIT_VALUES.hasMore
  @observable loadingMore = INIT_VALUES.loadingMore

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.FAVORITE) {
          this.init();
        }
      }
    );
    reaction(
      () => this.list,
      () => {
      }
    );
    reaction(
      () => this.app.favorite.currList,
      async () => {
        this.list = await this.fetchFav(Infinity, Infinity);
      }
    );
  }

  @action
  loadMore = async () => {
    // TODO
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES); // reset to initial state
    this.app.ui.location = Routes.FAVORITE; // change ui location, for tabs to render correctly
    this.list = await this.fetchFav(Infinity, Infinity);
  }

  fetchFav = async (skip = this.skip, limit = this.limit) => {
    if (this.app.favorite.currList.length === 0) return [];
    console.log('fetchFav');
    // Get all topics at favorite topic address list "currList"
    const orderBy = { field: 'endTime', direction: SortBy.ASCENDING };
    const filters = this.app.favorite.currList.map(topicAddress => ({ address: topicAddress }));
    const topics = await queryAllTopics(filters, orderBy, limit, skip);
    const result = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
    runInAction(() => {
      this.hasMore = false;
      this.loadingMore = false;
      this.loaded = true;
    });
    return _.map(result, (tx) => new Topic(tx));
  }
}
