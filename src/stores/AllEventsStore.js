import { observable, action, runInAction, computed, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation } from 'constants';
import { queryAllTopics, queryAllOracles, queryAllVotes } from '../network/graphQuery';
import Topic from './models/Topic';
import Oracle from './models/Oracle';

const INIT = {
  loading: true, // initial loading state
  loadingMore: false, // for scroll laoding animation
  list: [], // data list
  hasMoreTopics: true, // has more topics to fetch?
  hasMoreOracles: true, // has more oracles to fetch?
  skip: 0, // skip
};


export default class {
  @observable loading = INIT.loading
  @observable loadingMore = INIT.loadingMore
  @observable list = INIT.list
  @observable hasMoreTopics = INIT.hasMoreTopics
  @observable hasMoreOracles = INIT.hasMoreOracles
  @computed get hasMore() {
    return this.hasMoreOracles || this.hasMoreTopics;
  }
  @observable skip = INIT.skip
  limit = 24

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy, // when 'sortBy' changes
      () => {
        // and we're on the AllEvents page
        if (this.app.ui.location === AppLocation.allEvents) {
          this.init(); // fetch new events
        }
      }
    );
  }

  @action
  init = async (limit = this.limit) => {
    Object.assign(this, INIT); // reset all properties
    this.app.ui.location = AppLocation.allEvents;
    this.list = await this.fetchAllEvents(limit);
    runInAction(() => {
      this.skip += limit;
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
      votes = votes.reduce((accumulator, vote) => {
        const { voterQAddress, topicAddress, optionIdx } = vote;
        if (!_.find(accumulator, { voterQAddress, topicAddress, optionIdx })) accumulator.push(vote);
        return accumulator;
      }, []);
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
