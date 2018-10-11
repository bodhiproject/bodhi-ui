import _ from 'lodash';
import { observable, runInAction, action, reaction } from 'mobx';
import { Phases, OracleStatus, SortBy } from 'constants';
import { searchOracles, searchTopics } from '../../network/graphql/queries';

const TAB_BET = 0;
const TAB_VOTE = 1;
const TAB_SET = 2;
const TAB_FINALIZE = 3;
const TAB_WITHDRAW = 4;
export default class SearchStore {
  @observable oracles = [];
  @observable phrase = '';
  @observable loading = false;
  @observable loaded = false;
  @observable tabIdx = 0;
  @observable events = [];
  @observable bets = [];
  @observable votes = [];
  @observable sets = [];
  @observable withdraws = [];
  @observable finalizes = [];

  constructor(app) {
    this.app = app;
    reaction( // whenever the locale changes, update locale in local storage and moment
      () => this.phrase,
      () => {
        if (_.isEmpty(this.phrase)) {
          this.loading = false;
          this.loaded = false;
          this.oracles = [];
          this.withdraws = [];
          this.events = [];
          this.bets = [];
          this.votes = [];
          this.sets = [];
          this.finalizes = [];
        }
      },
    );
    reaction(
      () => this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.ui.searchBarMode && !_.isEmpty(this.phrase)) {
          this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    this.loading = true;
    this.loaded = false;
    await this.fetch();
    runInAction(() => {
      this.finalizes = this.oracles.filter(event => event.phase === Phases.FINALIZING);
      this.sets = this.oracles.filter(event => event.phase === Phases.RESULT_SETTING);
      this.votes = this.oracles.filter(event => event.phase === Phases.VOTING && event.status === 'VOTING');
      this.bets = this.oracles.filter(event => event.phase === Phases.BETTING && event.status === 'VOTING');
      switch (this.tabIdx) {
        case TAB_BET: {
          this.events = this.bets;
          break;
        }
        case TAB_VOTE: {
          this.events = this.votes;
          break;
        }
        case TAB_SET: {
          this.events = this.sets;
          break;
        }
        case TAB_FINALIZE: {
          this.events = this.finalizes;
          break;
        }
        case TAB_WITHDRAW: {
          this.events = this.withdraws;
          break;
        }
        default: {
          throw new Error(`Invalid tab index: ${this.tabIdx}`);
        }
      }
      this.loading = false;
      this.loaded = true;
    });
  }

  async fetch() {
    if (_.isEmpty(this.phrase)) return;
    const orderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
    let oracles = await searchOracles(this.app, this.phrase, null, orderBy);
    oracles = _.uniqBy(oracles, 'topicAddress');
    const topicFilters = [{ status: OracleStatus.WITHDRAW }];
    this.withdraws = await searchTopics(this.app, this.phrase, topicFilters);
    this.oracles = _.orderBy(oracles, ['endTime']);
  }
}
