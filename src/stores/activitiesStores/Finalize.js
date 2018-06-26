import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, AppLocation, SortBy } from '../../constants';
import { queryAllOracles } from '../../network/graphQuery';
import Oracle from '../models/Oracle';

const INIT = {
  loaded: false, // loading state?
  loadingMore: false, // for laoding icon?
  list: [], // data list
  hasMore: true, // has more data to fetch?
  offset: 0, // skip
  limit: 16, // loading batch amount
};

export default class {
  @observable loaded = INIT.loaded
  @observable loadingMore = INIT.loadingMore
  @observable list = INIT.list
  @observable hasMore = INIT.hasMore
  @observable offset = INIT.offset
  limit = INIT.limit

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
    this.reset(); // reset to initial state
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
    // we want to fetch all *Oracles* which is related to BOT token and waitResult status
    if (this.hasMore) {
      const filters = [{ token: Token.Bot, status: OracleStatus.WaitResult }];
      const orderBy = { field: 'endTime', direction: SortBy.Ascending };
      const data = await queryAllOracles(filters, orderBy, limit, skip);
      return _.uniqBy(data, 'txid').map((oracle) => new Oracle(oracle, this.app));
    }
    return INIT.list; // default return
  }

  reset = () => {
    this.loaded = INIT.loaded;
    this.loadingMore = INIT.loadingMore;
    this.list = INIT.list;
    this.hasMore = INIT.hasMore;
    this.offset = INIT.offset;
    this.limit = INIT.limit;
  }
}
