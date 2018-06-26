import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllOracles } from '../../network/graphQuery';
import Oracle from '../models/Oracle';


export default class {
  @observable loading = true
  @observable loadingMore = false
  @observable list = []
  @observable hasMore = true
  @observable skip = 0
  limit = 50

  constructor(app) {
    this.app = app;
  }

  @action
  init = async (limit = this.limit) => {
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

  fetch = async (limit = this.limit, skip = this.skip) => {
    let data = [];
    const filters = [{ token: Token.Qtum, status: OracleStatus.OpenResultSet }];

    _.each(this.app.wallet.addresses, (addressObj) => {
      filters.push({
        token: Token.Qtum,
        status: OracleStatus.WaitResult,
        resultSetterQAddress: addressObj.address,
      });
    });

    if (this.hasMore) {
      const orderBy = { field: 'endTime', direction: SortBy.Ascending };
      data = await queryAllOracles(filters, orderBy, limit, skip);
      data = _.uniqBy(data, 'txid').map((oracle) => new Oracle(oracle, this.app));
      if (data.length < skip + limit) this.hasMore = false;
    }
    return data;
  }
}
