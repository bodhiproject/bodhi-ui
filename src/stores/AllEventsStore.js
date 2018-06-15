/* eslint-disable */
import { observable, action, runInAction, transaction } from 'mobx';
import { Token, OracleStatus } from '../constants';
import { queryAllTopics, queryAllOracles } from '../network/graphQuery';
import _ from 'lodash';


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
  async fetchAllEvents(skip = this.skip, limit = this.limit) {
    limit /= 2; // eslint-disable-line
    const orderBy = { field: 'blockNum', direction: this.app.sortBy };
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
    let topics = await queryAllTopics(null, orderBy, limit, skip);
    let oracles = await queryAllOracles(filters, orderBy, limit, skip);
    // const event = {
    //   bet: Bet,
    //   vote: Vote,
    //   setResult: SetResult,
    //   finalize: Finalize,
    //   withdraw: Withdraw,
    // };
    runInAction(() => {
      console.log('TOPIC: ', topics[0]);
      console.log('ORACLE: ', oracles[0]);
      // topics = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
      // oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      // OR
      //  const allEvents = _.uniqBy([...topics, ...oracles], 'txid').map((evt) => new event[getPhase(evt)](evt, this.app))
      const allEvents = _.orderBy([...topics, ...oracles], ['blockNum'], this.app.sortBy);
      return allEvents;
    });
  }
}
