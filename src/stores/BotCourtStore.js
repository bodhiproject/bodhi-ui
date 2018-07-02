import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation } from '../constants';
import { queryAllOracles } from '../network/graphQuery';
import Oracle from './models/Oracle';

const INIT = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class BotCourtStore {
  @observable loaded = INIT.loaded
  @observable loadingMore = INIT.loadingMore
  @observable list = INIT.list
  @observable hasMore = INIT.hasMore
  @observable skip = INIT.skip
  limit = INIT.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy,
      () => {
        if (this.app.ui.location === AppLocation.botCourt) {
          this.init(this.skip);
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
    this.reset(); // reset to initial state
    this.app.ui.location = AppLocation.botCourt;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.loading = false;
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
        { token: Token.Bot, status: OracleStatus.Voting },
        { token: Token.Qtum,
          status: OracleStatus.WaitResult,
          excludeResultSetterQAddress,
        },
      ];
      let oracles = [];
      oracles = await queryAllOracles(filters, orderBy, limit, skip);
      oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      return _.orderBy(oracles, ['endTime'], this.app.sortBy.toLowerCase());
    }
    return INIT.list;
  }

  reset = () => {
    this.loaded = INIT.loaded;
    this.loadingMore = INIT.loadingMore;
    this.list = INIT.list;
    this.hasMore = INIT.hasMore;
    this.skip = INIT.skip;
    this.limit = INIT.limit;
  }
}
