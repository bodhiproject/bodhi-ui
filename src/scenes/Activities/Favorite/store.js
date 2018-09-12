import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Routes, SortBy } from 'constants';
import { queryAllTopics } from '../../../network/graphql/queries';
import Topic from '../../../stores/models/Topic';

const INIT_VALUES_FAVPAGE = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class {
  @observable favList = JSON.parse(localStorage.getItem('bodhi_dapp_favList')) || []; // Data example: '21e389b909c7ab977088c8d43802d459b0eb521a'

  @observable loaded = INIT_VALUES_FAVPAGE.loaded
  @observable list = INIT_VALUES_FAVPAGE.list
  @observable hasMore = INIT_VALUES_FAVPAGE.hasMore
  @observable loadingMore = INIT_VALUES_FAVPAGE.loadingMore

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
      () => this.favList,
      async () => {
        this.list = await this.fetchFav(Infinity, Infinity);
      }
    );
  }

  updateLocalStorageFavList() {
    localStorage.setItem('bodhi_dapp_favList', JSON.stringify(this.favList));
  }

  @action
  setFavorite = (topicAddress) => {
    if (this.isInFavorite(topicAddress)) this.favList = this.favList.filter(x => x !== topicAddress);
    else {
      this.favList.push(topicAddress);
      this.favList.replace(this.favList);
    }
    this.updateLocalStorageFavList();
  }

  @action
  isInFavorite = (topicAddress) => this.favList.some(x => x === topicAddress)

  @action
  loadMore = async () => {
    // TODO
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES_FAVPAGE); // reset to initial state
    this.app.ui.location = Routes.FAVORITE; // change ui location, for tabs to render correctly
    this.list = await this.fetchFav(Infinity, Infinity);
  }

  fetchFav = async (skip = this.skip, limit = this.limit) => {
    if (this.favList.length === 0) return [];
    // Get all topics at favorite topic address list "favList"
    const orderBy = { field: 'endTime', direction: SortBy.ASCENDING };
    const topicFilters = this.favList.map(topicAddress => ({ address: topicAddress }));
    const topics = await queryAllTopics(topicFilters, orderBy, limit, skip);
    const result = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
    runInAction(() => {
      this.hasMore = false;
      this.loadingMore = false;
      this.loaded = true;
    });
    return _.map(result, (tx) => new Topic(tx));
  }
}
