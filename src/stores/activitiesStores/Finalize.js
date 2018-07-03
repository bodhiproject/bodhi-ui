import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation, SortBy } from 'constants';
import { queryAllOracles } from '../../network/graphQuery';
import Oracle from '../models/Oracle';

const INIT_VALUES = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  skip: 0, // skip
  limit: 16, // loading batch amount
};

export default class {
  @observable loaded = INIT_VALUES.loaded
  @observable loadingMore = INIT_VALUES.loadingMore
  @observable list = INIT_VALUES.list
  @observable hasMore = INIT_VALUES.hasMore
  @observable skip = INIT_VALUES.skip
  limit = INIT_VALUES.limit

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === AppLocation.finalize) {
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
  init = async () => {
    Object.assign(this, INIT_VALUES); // reset to initial state
    this.app.ui.location = AppLocation.finalize; // change ui location, for tabs to render correctly
    this.list = await this.fetch(this.limit, this.skip);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit; // pump the skip eg. from 0 to 24
      const nextFewEvents = await this.fetch(this.limit, this.skip);
      runInAction(() => {
        this.list = [...this.list, ...nextFewEvents]; // push to existing list
        this.loadingMore = false; // stop showing the loading icon
      });
    }
  }

  fetch = async (limit = this.limit, skip = this.skip) => {
    // we want to fetch all *Oracles* which is related to BOT token and waitResult status
    if (this.hasMore) {
      const filters = [{ token: Token.Bot, status: OracleStatus.WaitResult }];
      const orderBy = { field: 'endTime', direction: SortBy.Ascending };
      const result = await queryAllOracles(filters, orderBy, limit, skip);
      if (result.length < limit) this.hasMore = false;
      return _.uniqBy(result, 'txid').map((oracle) => new Oracle(oracle, this.app));
    }
    return INIT_VALUES.list;
  }
}
