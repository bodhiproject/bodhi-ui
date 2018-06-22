import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllOracles } from '../../network/graphQuery';
import Oracle from '../models/Oracle';


export default class ActiviesStore {
  @observable loading = true
  @observable loadingMore = false
  @observable list = []
  @observable hasMore = true
  @observable skip = 0
  limit = 50

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.sortBy, // when 'sortBy' changes
      () => {
        if (this.app.ui.location === AppLocation.qtumPrediction) {
          this.init(this.skip);
        }
      }
    );
  }

  @action.bound
  async init(limit = this.limit) {
    if (limit === this.limit) {
      this.skip = 0;
    }
    this.hasMore = true;
    this.app.ui.location = AppLocation.resultSetting;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.skip += limit;
      this.loading = false;
    });
  }

  @action.bound
  async loadMore() {
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
    let data = [];
    const filters = [
      { token: Token.Qtum, status: OracleStatus.Voting },
      { token: Token.Qtum, status: OracleStatus.Created },
    ];
    const orderBy = { field: 'endTime', direction: SortBy.Ascending };
    if (this.hasMore) {
      data = await queryAllOracles(filters, orderBy, limit, skip);
      data = _.uniqBy(data, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (data.length < limit) this.hasMore = false;
    }
    return data;
  }
}
