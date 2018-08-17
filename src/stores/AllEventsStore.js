import { observable, action, runInAction, computed, reaction } from 'mobx';
import _ from 'lodash';
import { OracleStatus, Routes } from 'constants';
import { queryAllTopics, queryAllOracles } from '../network/graphql/queries';
import Topic from './models/Topic';
import Oracle from './models/Oracle';

const INIT_VALUES = {
  loaded: true, // INIT_VALUESial loaded state
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
  limit = 24

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy + this.app.wallet.addresses + this.app.global.syncBlockNum + this.app.refreshing,
      () => {
        if (this.app.ui.location === Routes.ALL_EVENTS) {
          this.init();
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
      this.loading = false;
    });
  }

  @action
  loadMoreEvents = async () => {
    this.loadingMore = true;
    this.skip += this.limit;
    const nextFewEvents = await this.fetchAllEvents();
    runInAction(() => {
      this.list = [...this.list, ...nextFewEvents];
      this.loadingMore = false;
    });
  }

  fetchAllEvents = async (limit = this.limit, skip = this.skip) => {
    limit /= 2; // eslint-disable-line
    skip /= 2; // eslint-disable-line
    const orderBy = { field: 'blockNum', direction: this.app.sortBy };
    let topics = [];
    if (this.hasMoreTopics) {
      const topicFilters = [{ status: OracleStatus.WITHDRAW }];
      topics = await queryAllTopics(topicFilters, orderBy, limit, skip);
      topics = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
      if (topics.length < limit) this.hasMoreTopics = false;
    }
    let oracles = [];
    if (this.hasMoreOracles) {
      oracles = await queryAllOracles(undefined, orderBy, limit, skip);
      oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (oracles.length < limit) this.hasMoreOracles = false;
    }
    const allEvents = _.orderBy([...topics, ...oracles], ['blockNum'], this.app.sortBy.toLowerCase());
    return allEvents;
  }
}
