import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, Routes } from '../constants';
import { queryAllOracles } from '../network/graphql/queries';
import Oracle from './models/Oracle';

const INIT_VALUES = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class BotCourtStore {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy + this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.BOT_COURT) {
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
  init = async (limit = this.limit) => {
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.BOT_COURT;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.loaded = false;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit;
      const nextFewEvents = await this.fetch();
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents];
        this.loadingMore = false;
      });
    }
  }

  async fetch(limit = this.limit, skip = this.skip) {
    if (this.hasMore) {
      const orderBy = { field: 'endTime', direction: this.app.sortBy };
      const excludeResultSetterQAddress = this.app.wallet.addresses.map(({ address }) => address);
      const filters = [
        { token: Token.BOT, status: OracleStatus.VOTING },
        { token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          excludeResultSetterQAddress,
        },
      ];
      let result = [];
      result = await queryAllOracles(filters, orderBy, limit, skip);
      result = _.uniqBy(result, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (result.length < limit) this.hasMore = false;
      return _.orderBy(result, ['endTime'], this.app.sortBy.toLowerCase());
    }
    return INIT_VALUES.list;
  }
}
