import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllOracles } from '../../network/graphQuery';
import Oracle from '../models/Oracle';


export default class {
  @observable loaded = false // initial loading state
  @observable loadingMore = false // for laoding icon
  @observable list = []
  @observable hasMore = true // we don't have any more to fetch from api, don't make api call
  @observable offset = 0
  limit = 10

  constructor(app) {
    this.app = app;
    reaction(
      () => this.list,
      () => {
        if (this.loaded && this.list.length <= this.offset) this.hasMore = false;
      }
    );
  }

  @action
  init = async () => {
    const currentLimit = this.limit;
    this.app.ui.location = AppLocation.resultSetting; // change ui location, for tabs to render correctly
    this.list = await this.fetch(currentLimit, this.offset);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.offset += this.limit; // pump the offset eg. from 0 to 24
      const nextFewEvents = await this.fetch(this.limit, this.offset);
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents]; // push to existing list
        this.loadingMore = false; // stop showing the loading icon
      });
    }
  }

  fetch = async (limit = this.limit, skip = this.offset) => {
    let data = [];
    const filters = [{ token: Token.Qtum, status: OracleStatus.OpenResultSet }];

    _.each(this.app.wallet.addresses, (addressObj) => {
      filters.push({
        token: Token.Qtum,
        status: OracleStatus.WaitResult,
        resultSetterQAddress: addressObj.address,
      });
    });

    const orderBy = { field: 'endTime', direction: SortBy.Ascending };
    data = await queryAllOracles(filters, orderBy, limit, skip);
    return _.uniqBy(data, 'txid').map((oracle) => new Oracle(oracle, this.app));
  }

  @action
  reset = async () => {
    this.loaded = false;
    this.loadingMore = false;
    this.list = [];
    this.hasMore = true;
    this.offset = 0;
    this.limit = 10;
  }
}
