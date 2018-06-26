import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';
import { OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllVotes, queryAllTopics } from '../../network/graphQuery';
import Topic from '../models/Topic';

export default class {
  @observable loading = true
  @observable loadingMore = false
  @observable list = []
  @observable hasMore = true
  @observable skip = 0
  limit = 50

  constructor(app) {
    this.app = app;
  }

  @action
  init = async (limit = this.limit) => {
    if (limit === this.limit) {
      this.skip = 0;
    }
    this.hasMore = true;
    this.app.ui.location = AppLocation.withdraw;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.skip += limit;
      this.loading = false;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit;
      const nextFewEvents = await this.fetch();
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents];
        this.loadingMore = false;
      });
    }
  }

  fetch = async (limit = this.limit, skip = this.skip) => {
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
    votes = votes.reduce((acc, v) => {
      const { voterQAddress, topicAddress, optionIdx } = v;
      if (!_.find(acc, { voterQAddress, topicAddress, optionIdx })) acc.push(v);
      return acc;
    }, []);

    // Fetch topics against votes that have the winning result index
    _.each(votes, ({ topicAddress, optionIdx }) => {
      topicFilters.push({ status: OracleStatus.Withdraw, address: topicAddress, resultIdx: optionIdx });
    });
    const result = await queryAllTopics(topicFilters, orderBy, limit, skip);
    const topics = _.uniqBy(result, 'txid').map((topic) => new Topic(topic, this.app));

    if (topics.length < limit) this.hasMore = false;
    return topics;
  }
}

