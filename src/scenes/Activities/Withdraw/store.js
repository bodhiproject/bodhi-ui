import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { isEmpty, each, find } from 'lodash';
import { OracleStatus, Routes, SortBy } from 'constants';

import { queryAllVotes, queryAllTopics } from '../../../network/graphql/queries';

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
    reaction(
      () => toJS(this.app.wallet.addresses) + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.WITHDRAW) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.WITHDRAW && this.app.global.online) {
          if (this.loadingMore) this.loadMore();
          else this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES); // reset to initial state
    this.app.ui.location = Routes.WITHDRAW; // change ui location, for tabs to render correctly
    this.list = await this.fetch(this.limit, this.skip);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return;
    }

    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit; // pump the skip eg. from 0 to 24
      try {
        const nextFewEvents = await this.fetch(this.limit, this.skip);
        runInAction(() => {
          this.list = [...this.list, ...nextFewEvents]; // push to existing list
          this.loadingMore = false; // stop showing the loading icon
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  fetch = async (limit = this.limit, skip = this.skip) => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      return;
    }

    if (this.hasMore) {
      const voteFilters = [];
      const topicFilters = [];
      const orderBy = { field: 'endTime', direction: SortBy.ASCENDING };

      // Get all votes for all your addresses
      each(this.app.wallet.addresses, (item) => {
        voteFilters.push({ voterAddress: item.address });
        topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address, language: this.app.ui.locale });
      });

      // Filter votes
      let votes = await queryAllVotes(voteFilters);
      votes = votes.reduce((accumulator, vote) => {
        const { voterAddress, topicAddress, optionIdx } = vote;
        if (!find(accumulator, { voterAddress, topicAddress, optionIdx })) accumulator.push(vote);
        return accumulator;
      }, []);

      // Fetch topics against votes that have the winning result index
      each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx, language: this.app.ui.locale });
      });
      const { topics, pageInfo } = await queryAllTopics(this.app, topicFilters, orderBy, limit, skip);
      this.hasMore = pageInfo.hasNextPage;
      return topics;
    }
    return INIT_VALUES.list; // default return
  }
}
