import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllVotes, queryAllTopics } from '../../network/graphQuery';
import Topic from '../models/Topic';

const INIT = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class {
  @observable loaded = INIT.loaded
  @observable loadingMore = INIT.loadingMore
  @observable list = INIT.list
  @observable hasMore = INIT.hasMore
  @observable skip = INIT.skip
  limit = INIT.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.list,
      () => {
        if (this.loaded && this.list.length < this.skip) this.hasMore = false;
      }
    );
  }

  @action
  init = async () => {
    this.reset(); // reset to initial state
    this.app.ui.location = AppLocation.withdraw; // change ui location, for tabs to render correctly
    this.list = await this.fetch(this.limit, this.skip);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit; // pump the skip eg. from 0 to 24
      const nextFewEvents = await this.fetch(this.limit, this.skip);
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents]; // push to existing list
        this.loadingMore = false; // stop showing the loading icon
      });
    }
  }

  fetch = async (limit = this.limit, skip = this.skip) => {
    if (this.hasMore) {
      const voteFilters = [];
      const topicFilters = [];
      const orderBy = { field: 'endTime', direction: SortBy.Ascending };

      // Get all votes for all your addresses
      _.each(this.app.wallet.addresses, (item) => {
        voteFilters.push({ voterQAddress: item.address });
        topicFilters.push({ status: OracleStatus.Withdraw, creatorAddress: item.address });
      });

      // Filter votes
      let votes = await queryAllVotes(voteFilters);
      votes = votes.reduce((accumulator, vote) => {
        const { voterQAddress, topicAddress, optionIdx } = vote;
        if (!_.find(accumulator, { voterQAddress, topicAddress, optionIdx })) accumulator.push(vote);
        return accumulator;
      }, []);

      // Fetch topics against votes that have the winning result index
      _.each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: topicAddress, resultIdx: optionIdx });
      });
      const result = await queryAllTopics(topicFilters, orderBy, limit, skip);
      const topics = _.uniqBy(result, 'txid').map((topic) => new Topic(topic, this.app));

      return topics;
    }
    return INIT.list; // default return
  }

  reset = () => {
    this.loaded = INIT.loaded;
    this.loadingMore = INIT.loadingMore;
    this.list = INIT.list;
    this.hasMore = INIT.hasMore;
    this.skip = INIT.skip;
    this.limit = INIT.limit;
  }
}
