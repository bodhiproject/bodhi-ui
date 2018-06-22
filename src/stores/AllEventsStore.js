import { observable, action, runInAction, computed, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation } from '../constants';
import { queryAllTopics, queryAllOracles, queryAllVotes } from '../network/graphQuery';
import Topic from './models/Topic';
import Oracle from './models/Oracle';


export default class AllEventsStore {
  @observable loading = true
  @observable loadingMore = false
  @observable list = []
  @observable hasMoreTopics = true
  @observable hasMoreOracles = true
  @computed get hasMore() {
    return this.hasMoreOracles || this.hasMoreTopics;
  }
  @observable skip = 0
  limit = 50

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy, // when 'sortBy' changes
      () => {
        // and we're on the AllEvents page
        if (this.app.ui.location === AppLocation.allEvents) {
          this.init(this.skip); // fetch new events
        }
      }
    );
  }

  @action.bound
  async init(limit = this.limit) {
    if (limit === this.limit) {
      this.skip = 0;
    }
    this.hasMoreOracles = true;
    this.hasMoreTopics = true;
    this.app.ui.location = AppLocation.allEvents;
    this.list = await this.fetchAllEvents(limit);
    runInAction(() => {
      this.skip += limit;
      this.loading = false;
    });
  }

  @action.bound
  async loadMoreEvents() {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit;
      const nextFewEvents = await this.fetchAllEvents();
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents];
        this.loadingMore = false;
      });
    }
  }

  async fetchAllEvents(limit = this.limit, skip = this.skip) {
    limit /= 2; // eslint-disable-line
    const orderBy = { field: 'blockNum', direction: this.app.sortBy };
    const filters = [
      // finalizing
      { token: Token.Bot, status: OracleStatus.WaitResult },
      // voting
      { token: Token.Bot, status: OracleStatus.Voting },
      // betting
      { token: Token.Qtum, status: OracleStatus.Voting },
      { token: Token.Qtum, status: OracleStatus.Created },
      // result setting
      { token: Token.Qtum, status: OracleStatus.OpenResultSet },
      { token: Token.Qtum, status: OracleStatus.WaitResult },
    ];
    let topics = [];
    if (this.hasMoreTopics) {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(this.app.wallet.addresses, ({ address }) => {
        voteFilters.push({ voterQAddress: address });
        topicFilters.push({ status: OracleStatus.Withdraw, creatorAddress: address });
      });

      // Filter votes
      let votes = await queryAllVotes(voteFilters);
      // Filter out unique votes by voter address, topic address, and option index.
      votes = _.uniqBy(votes, ['voterQAddress', 'topicAddress', 'optionIdx']);
      // Fetch topics against votes that have the winning result index
      _.each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: topicAddress, resultIdx: optionIdx });
      });
      topics = await queryAllTopics(topicFilters, orderBy, limit, skip);
      topics = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
      if (topics.length < limit) this.hasMoreTopics = false;
    }
    let oracles = [];
    if (this.hasMoreOracles) {
      oracles = await queryAllOracles(filters, orderBy, limit, skip);
      oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (oracles.length < limit) this.hasMoreOracles = false;
    }
    const allEvents = _.orderBy([...topics, ...oracles], ['blockNum'], this.app.sortBy.toLowerCase());
    return allEvents;
  }
}
