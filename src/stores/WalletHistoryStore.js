import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';

import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { AppLocation, SortBy, TransactionType } from '../constants';


export default class WalletHistoryStore {
  @observable list = []
  @observable orderBy = 'createdTime'
  @observable direction = SortBy.Descending
  @observable limit = 500
  @observable skip = 0
  @observable perPage = 10
  @observable page = 0
  @observable expanded = []

  fullList = []

  // @computed get hasMore() {
  //   return this.hasMoreOracles || this.hasMoreTopics;
  // }
  // limit = 50

  constructor(app) {
    this.app = app;

    // reaction(() => this.perPage, async () => {
    //   console.log('perpaged change');
    //   await this.queryTransactions();
    // });
  }

  @action.bound
  async getTransactions(orderBy, direction, limit, skip) {
    await this.queryTransactions(orderBy, direction, limit, skip);
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
    this.list = _.slice(this.fullList, 0, this.perPage);
  }

  @action.bound
  onExpandedChange(expanded) {
    this.expanded = expanded;
  }

  @action
  async queryTransactions(orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) {
    try {
      const filters = [{ type: TransactionType.Transfer }];
      const orderByObj = { field: orderBy, direction };

      const result = await queryAllTransactions(filters, orderByObj, limit, skip);
      this.fullList = _.map(result, (tx) => new Transaction(tx));
      this.list = _.slice(this.fullList, 0, this.perPage);
    } catch (error) {
      console.error(error); // eslint-disable-line
      this.fullList = [];
      this.list = [];
    }
  }
}
