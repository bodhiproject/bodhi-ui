import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation } from '../constants';
import { queryAllOracles } from '../network/graphQuery';
import Oracle from './models/Oracle';


export default class BotCourtStore {
  @observable loading = true
  @observable loadingMore = false
  @observable list = []
  @observable hasMore = true
  @observable skip = 0
  limit = 16

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy, // when 'sortBy' changes
      () => {
        if (this.app.ui.location === AppLocation.botCourt) {
          this.init(this.skip);
        }
      }
    );
  }

  @action
  init = async (limit = this.limit) => {
    if (limit === this.limit) {
      this.skip = 0;
    }
    this.hasMore = true;
    this.app.ui.location = AppLocation.botCourt;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.skip += limit;
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
    if (this.hasMore) {
      oracles = await queryAllOracles(filters, orderBy, limit, skip);
      oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (oracles.length < limit) this.hasMore = false;
    }
    const botCourt = _.orderBy(oracles, ['endTime'], this.app.sortBy.toLowerCase());
    return botCourt;
  }
}
