import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';

import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { SortBy, TransactionType } from '../constants';


const INIT_VALUES = {
  fullList: [],
  list: [],
  orderBy: 'createdTime',
  direction: SortBy.Descending.toLowerCase(),
  limit: 500,
  skip: 0,
  perPage: 10,
  page: 0,
};

export default class WalletHistoryStore {
  @observable fullList = INIT_VALUES.fullList
  @observable list = INIT_VALUES.list
  @observable orderBy = INIT_VALUES.orderBy
  @observable direction = INIT_VALUES.direction
  @observable limit = INIT_VALUES.limit
  @observable skip = INIT_VALUES.skip
  @observable perPage = INIT_VALUES.perPage
  @observable page = INIT_VALUES.page

  constructor() {
    reaction(
      () => this.page,
      () => {
        const start = this.page * this.perPage;
        this.list = _.slice(this.fullList, start, start + this.perPage);
      }
    );

    reaction(
      () => this.perPage,
      () => this.list = _.slice(this.fullList, 0, this.perPage),
    );

    reaction(
      () => this.orderBy,
      () => {
        const start = this.page * this.perPage;
        this.fullList = _.orderBy(this.fullList, [this.orderBy], [this.direction]);
        this.list = _.slice(this.fullList, start, start + this.perPage);
      }
    );

    reaction(
      () => this.direction,
      () => {
        const start = this.page * this.perPage;
        this.fullList = _.orderBy(this.fullList, [this.orderBy], [this.direction]);
        this.list = _.slice(this.fullList, start, start + this.perPage);
      }
    );
  }

  @action
  init = async () => {
    this.reset();
    await this.queryTransactions();
  }

  @action
  queryTransactions = async (orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) => {
    try {
      const filters = [{ type: TransactionType.Transfer }];
      const orderByObj = { field: orderBy, direction: direction.toUpperCase() };
      const result = await queryAllTransactions(filters, orderByObj, limit, skip);

      runInAction(() => {
        this.fullList = _.map(result, (tx) => new Transaction(tx));
        this.list = _.slice(this.fullList, 0, this.perPage);
      });
    } catch (error) {
      console.error(error); // eslint-disable-line

      runInAction(() => {
        this.fullList = [];
        this.list = [];
      });
    }
  }

  reset = () => {
    this.fullList = INIT_VALUES.fullList;
    this.list = INIT_VALUES.list;
    this.orderBy = INIT_VALUES.orderBy;
    this.direction = INIT_VALUES.direction;
    this.limit = INIT_VALUES.limit;
    this.skip = INIT_VALUES.skip;
    this.perPage = INIT_VALUES.perPage;
    this.page = INIT_VALUES.page;
  }
}
