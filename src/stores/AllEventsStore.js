import { observable, action, runInAction, computed, reaction, toJS } from 'mobx';
import _ from 'lodash';
import { OracleStatus, Routes } from 'constants';
import { queryAllTopics, queryAllOracles } from '../network/graphql/queries';

const INIT_VALUES = {
  loaded: false, // INIT_VALUESial loaded state
  loadingMore: false, // for scroll laoding animation
  list: [], // data list
  hasMoreTopics: true, // has more topics to fetch?
  hasMoreOracles: true, // has more oracles to fetch?
  skip: 0, // skip
};


export default class {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMoreTopics = INIT_VALUES.hasMoreTopics
  @observable hasMoreOracles = INIT_VALUES.hasMoreOracles
  @computed get hasMore() {
    return this.hasMoreOracles || this.hasMoreTopics;
  }
  @observable skip = INIT_VALUES.skip
  @observable limit = 24

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy + toJS(this.app.wallet.addresses) + this.app.global.syncBlockNum + this.app.refreshing,
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
    limit /= 2; // eslint-disable-line
    skip /= 2; // eslint-disable-line
    const orderBy = { field: 'blockNum', direction: this.app.sortBy };
    let topics = [];
    let oracles = [];
    if (this.hasMoreTopics) {
      const topicFilters = [{ status: OracleStatus.WITHDRAW }];
      const { topics: aliasTopics, pageInfo } = await queryAllTopics(this.app, topicFilters, orderBy, limit, skip);
      topics = aliasTopics;
      this.hasMoreTopics = pageInfo.hasNextPage;
    }
    if (this.hasMoreOracles) {
      const { oracles: aliasOracles, pageInfo } = await queryAllOracles(this.app, undefined, orderBy, limit, skip);
      this.hasMoreOracles = pageInfo.hasNextPage;
      oracles = aliasOracles;
    }
    const allEvents = _.orderBy([...topics, ...oracles], ['blockNum'], this.app.sortBy.toLowerCase());
    return allEvents;
  }
}
