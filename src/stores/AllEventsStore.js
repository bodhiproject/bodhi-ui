import { observable, action, runInAction } from 'mobx';
import { Token, OracleStatus } from '../constants';


export default class AllEventsStore {
  @observable loading = true
  @observable list = []
  @observable skip = 0
  limit = 50

  constructor(app) {
    this.app = app;
  }

  @action.bound
  async init() {
    this.list = await this.fetchAllEvents();
    runInAction(() => {
      this.loading = false;
    });
  }

  @action.bound
  async loadMoreEvents() {
    this.skip += this.limit;
    const newEvents = await this.fetchAllEvents();
    runInAction(() => {
      this.list = [...this.list, ...newEvents];
    });
  }

  @action.bound
  fetchAllEvents(skip = this.skip, limit = this.limit) {
    const { sortBy, wallet } = this.app;
    const orderBy = { field: 'blockNum', direction: sortBy };
    const filters = [
      // finalizing
      { token: Token.Bot, status: OracleStatus.WaitResult },
      // voting
      { token: Token.Bot, status: OracleStatus.Voting },
      // betting
      { token: Token.Qtum, status: OracleStatus.Voting },
      { token: Token.Qtum, status: OracleStatus.Created },
      // result setting
      { token: Token.Qtum, status: OracleStatus.OpenResultSet },
      { token: Token.Qtum, status: OracleStatus.WaitResult },
    ];
    console.log('FETCH ALL EVENTS');
    // make graphql request
  }
}
