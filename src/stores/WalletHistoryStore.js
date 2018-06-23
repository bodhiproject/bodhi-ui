import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';

import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { AppLocation, SortBy, TransactionType } from '../constants';


export default class WalletHistoryStore {
  @observable list = []
  @observable orderBy = 'createdTime'
  @observable direction = SortBy.Descending
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
  }

  @action.bound
  init() {
    this.app.ui.location = AppLocation.wallet;
  }

  @action.bound
  async getTransactions(orderBy, direction, limit, skip) {
    // if (limit === this.limit) {
    //   this.skip = 0;
    // }
    const list = await this.queryTransactions(orderBy, direction, limit, skip);

    runInAction(() => {
      this.list = list;
      // this.skip += this.limit;
      // this.loading = false;
    });
  }

  @action.bound
  onPageChange(page) {
    this.expanded = [];

    let newSkip = this.skip;
    if (Math.floor(this.list.length / this.perPage) - 1 === page) {
      newSkip = this.list.length;
    }
    this.page = page;
    this.skip = newSkip;
  }

  @action.bound
  onPerPageChange(perPage) {
    this.expanded = [];
    this.perPage = perPage;
  }

  @action.bound
  onExpandedChange(expanded) {
    this.expanded = expanded;
  }

  async queryTransactions(orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) {
    try {
      const filters = [{ type: TransactionType.Transfer }];
      const orderByObj = { field: orderBy, direction };

      let result = await queryAllTransactions(filters, orderByObj, limit, skip);
      result = _.orderBy(result, [orderBy], [direction]);
      result = _.map(result, (tx) => new Transaction(tx));
      return result;
    } catch (error) {
      console.error(error); // eslint-disable-line
      return [];
    }
  }
}
