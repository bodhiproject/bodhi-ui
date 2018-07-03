import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { OracleStatus, AppLocation, SortBy } from 'constants';
import { queryAllVotes, queryAllTopics } from '../../network/graphQuery';
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
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    const { wallet: { addresses } } = this.app;
    const { syncBlockNum } = this.global;
    reaction(
      () => addresses + syncBlockNum,
      () => {
        if (this.app.ui.location === AppLocation.withdraw) {
          this.init();
        }
      }
    );
    reaction(
      () => this.list,
      () => {
        if (this.loaded && this.list.length < this.skip) this.hasMore = false;
      }
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES); // reset to initial state
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
<<<<<<< HEAD
    return INIT_VALUES.list; // default return
=======
    return INIT.list; // default return
  }

  reset = () => {
    Object.assign(this, INIT);
>>>>>>> update reset with INIT_VALUES
  }
}
