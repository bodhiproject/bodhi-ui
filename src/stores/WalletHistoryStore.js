import { observable, action } from 'mobx';
import _ from 'lodash';

import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { SortBy, TransactionType } from '../constants';


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

  @action
  queryTransactions = async (orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) => {
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

  @action
  onPageChange = (page) => {
    this.expanded = [];
    this.page = page;

    const start = this.page * this.perPage;
    this.list = _.slice(this.fullList, start, start + this.perPage);
  }

  @action
  onPerPageChange = (perPage) => {
    this.expanded = [];
    this.perPage = perPage;
    this.list = _.slice(this.fullList, 0, this.perPage);
  }

  @action
  onExpandedChange = (expanded) => {
    this.expanded = expanded;
  }

  @action
  onSortingChange = (orderBy, direction) => {
    this.orderBy = orderBy;
    this.direction = direction;
    this.list = _.orderBy(this.list, [orderBy], [direction]);
  }
}
