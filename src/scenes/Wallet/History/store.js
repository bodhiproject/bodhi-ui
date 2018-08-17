import { observable, action, reaction, runInAction } from 'mobx';
import _ from 'lodash';
import { SortBy, TransactionType } from 'constants';
import { Transaction } from 'models';

import { queryAllTransactions } from '../../../network/graphql/queries';


const INIT_VALUES = {
  fullList: [],
  list: [],
  orderBy: 'createdTime',
  direction: SortBy.DESCENDING.toLowerCase(),
  limit: 500,
  skip: 0,
  perPage: 10,
  page: 0,
};

export default class {
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
    Object.assign(this, INIT_VALUES);
    await this.queryTransactions();
  }

  @action
  queryTransactions = async (orderBy = this.orderBy, direction = this.direction, limit = this.limit, skip = this.skip) => {
    try {
      const filters = [{ type: TransactionType.TRANSFER }];
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

  @action
  addTransaction = (tx) => {
    this.fullList.push(tx);
    this.fullList = _.orderBy(this.fullList, [this.orderBy], [this.direction]);

    const start = this.page * this.perPage;
    this.list = _.slice(this.fullList, start, start + this.perPage);
  }
}
