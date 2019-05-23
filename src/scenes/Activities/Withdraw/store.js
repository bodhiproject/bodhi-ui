import { observable, action, runInAction, reaction, toJS } from 'mobx';
import { isEmpty, each, find } from 'lodash';
import { EVENT_STATUS, Routes, SortBy } from 'constants';
import { bets, events } from '../../../network/graphql/queries';

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
      () => toJS(this.app.naka.account) + this.app.global.syncBlockNum,
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
    this.app.ui.location = Routes.WITHDRAW; // change ui location, for tabs to render correctly
    await this.loadFirst();
  }

  @action
  loadFirst = async () => {
    this.hasMore = true;
    this.list = await this.fetch(this.limit, 0);
    runInAction(() => {
      this.loaded = true;
    });
  }


  @action
  loadMore = async () => {
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
    if (this.hasMore) {
      const orderBy = { field: 'arbitrationEndTime', direction: SortBy.ASCENDING };

      const { naka: { checkLoggedIn }, graphqlClient } = this.app;
      await checkLoggedIn();
      const { naka: { account }, ui: { locale } } = this.app;

      const betFilters = { betterAddress: account };
      const eventFilters = { OR: [{ status: EVENT_STATUS.WITHDRAW, ownerAddress: account, language: locale }] };

      // Filter votes
      let votes = await bets(graphqlClient, { filter: betFilters });
      votes = votes.items.reduce((accumulator, vote) => {
        const { betterAddress, eventAddress, resultIndex } = vote;
        if (!find(accumulator, { betterAddress, eventAddress, resultIndex })) accumulator.push(vote);
        return accumulator;
      }, []);

      // Fetch topics against votes that have the winning result index
      each(votes, ({ eventAddress, resultIndex }) => {
        eventFilters.OR.push({ status: EVENT_STATUS.WITHDRAWING, address: eventAddress, currentResultIndex: resultIndex, language: locale });
      });
      const res = await events(graphqlClient, { filter: eventFilters, orderBy, limit, skip });
      if (res.pageInfo) this.hasMore = res.pageInfo.hasNextPage;
      else this.hasMore = false;
      return res.items;
    }
    return INIT_VALUES.list;
  }
}
