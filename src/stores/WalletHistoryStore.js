import { observable, action, reaction } from 'mobx';

import { queryAllTransactions } from '../network/graphQuery';
import { SortBy, TransactionType } from '../constants';


export default class WalletHistoryStore {
  @observable list = []
  @observable orderBy = 'createdTime'
  @observable direction = SortBy.Descending.toLowerCase()
  @observable limit = 50
  @observable skip = 0
  @observable perPage = 10
  @observable page = 0
  @observable expanded = []

  // @computed get hasMore() {
  //   return this.hasMoreOracles || this.hasMoreTopics;
  // }
  // limit = 50

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy, // when 'sortBy' changes
      () => {
        // and we're on the AllEvents page
        // if (this.app.ui.location === AppLocation.allEvents) {
        //   this.init(this.skip); // fetch new events
        // }
      }
    );
  }

  @action.bound
  async getTransactions(orderBy, direction, limit, skip) {
    // if (limit === this.limit) {
    //   this.skip = 0;
    // }
    // this.hasMoreOracles = true;
    // this.hasMoreTopics = true;
    // this.app.ui.location = AppLocation.allEvents;
    this.list = await this.fetchTransactions(orderBy, direction, limit, skip);

    // runInAction(() => {
    //   this.skip += this.limit;
    //   this.loading = false;
    // });
  }

  @action.bound
  async loadMoreEvents() {
    // if (this.hasMore) {
    //   this.loadingMore = true;
    //   this.skip += this.limit;
    //   const nextFewEvents = await this.fetchAllEvents();
    //   runInAction(() => {
    //     this.list = [...this.list, ...nextFewEvents];
    //     this.loadingMore = false;
    //   });
    // }
  }

  async queryTransactions(orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) {
    try {
      const filters = [{ type: TransactionType.Transfer }];
      const orderByObj = { field: orderBy, direction };

      const result = await queryAllTransactions(filters, orderByObj, limit, skip);
      // TODO: convert to Transaction class
      return result;
    } catch (error) {
      console.error(error); // eslint-disable-line
      return [];
    }
  }
}
