import { observable, action, runInAction, reaction, toJS } from 'mobx';
import _ from 'lodash';
import { Token, OracleStatus, Routes } from '../../constants';
import { queryAllOracles } from '../../network/graphql/queries';

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
      () => this.app.sortBy + toJS(this.app.wallet.addresses) + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.BOT_COURT) {
          this.init();
        }
      }
    );
    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.BOT_COURT && this.app.global.online) {
          if (this.loadingMore) this.loadMore();
          else this.init();
        }
      }
    );
  }

  @action
  init = async (limit = this.limit) => {
    Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.BOT_COURT;
    this.list = await this.fetch(limit);
    runInAction(() => {
      this.loaded = true;
    });
  }

  @action
  loadMore = async () => {
    if (this.hasMore) {
      this.loadingMore = true;
      this.skip += this.limit;
      try {
        const nextFewEvents = await this.fetch();
        runInAction(() => {
          this.list = [...this.list, ...nextFewEvents];
          this.loadingMore = false;
        });
      } catch (e) {
        this.skip -= this.limit;
      }
    }
  }

  async fetch(limit = this.limit, skip = this.skip) {
    if (this.hasMore) {
      const orderBy = { field: 'endTime', direction: this.app.sortBy };
      const excludeResultSetterAddress = this.app.wallet.addresses.map(({ address }) => address);
      const filters = [
        { token: Token.BOT, status: OracleStatus.VOTING, language: this.app.ui.locale },
        { token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          excludeResultSetterAddress,
          language: this.app.ui.locale,
        },
      ];
      const { oracles, pageInfo: { hasNextPage } } = await queryAllOracles(this.app, filters, orderBy, limit, skip);
      this.hasMore = hasNextPage;
      return _.orderBy(oracles, ['endTime'], this.app.sortBy.toLowerCase());
    }
    return INIT_VALUES.list;
  }
}
