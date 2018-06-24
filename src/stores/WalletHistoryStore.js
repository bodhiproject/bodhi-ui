import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';

import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { AppLocation, SortBy, TransactionType } from '../constants';


export default class WalletHistoryStore {
  @observable fullList = []
  @observable list = []
  @observable orderBy = 'createdTime'
  @observable direction = SortBy.Descending
  @observable limit = 500
  @observable skip = 0
  @observable perPage = 10
  @observable page = 0
  @observable expanded = []

  constructor(app) {
    this.app = app;
  }

  @action.bound
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

  @action.bound
  onPageChange(page) {
    this.expanded = [];
    this.page = page;

    const start = this.page * this.perPage;
    this.list = _.slice(this.fullList, start, start + this.perPage);
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
}
