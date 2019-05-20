import { isEmpty, filter } from 'lodash';
import { observable, runInAction, action, reaction } from 'mobx';
import { EVENT_STATUS, Phases, OracleStatus, SortBy } from 'constants';
import { searchEvents } from '../../network/graphql/queries';

const TAB_BET = 0;
const TAB_VOTE = 1;
const TAB_SET = 2;
const TAB_WITHDRAW = 3;
const INIT_VALUES = {
  phrase: '',
  loading: false,
  tabIdx: 0,
  bets: [],
  sets: [],
  votes: [],
  withdraws: [],
};

export default class SearchStore {
  @observable phrase = INIT_VALUES.phrase;
  @observable loading = INIT_VALUES.loading;
  @observable tabIdx = INIT_VALUES.tabIdx;
  @observable bets = INIT_VALUES.bets;
  @observable sets = INIT_VALUES.sets;
  @observable votes = INIT_VALUES.votes;
  @observable withdraws = INIT_VALUES.withdraws;

  constructor(app) {
    this.app = app;
    reaction(
      () => this.phrase,
      () => this.fetchEvents(),
    );
    reaction(
      () => this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.ui.searchBarMode && !_.isEmpty(this.phrase) && this.app.global.online) {
          this.init();
        }
      }
    );
  }

  @action
  init = async () => {
    this.loaded = false;
    await this.fetch();

    runInAction(() => {
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
        case TAB_WITHDRAW: {
          this.events = this.withdraws;
          break;
        }
        default: {
          throw new Error(`Invalid tab index: ${this.tabIdx}`);
        }
      }
      
      this.loaded = true;
    });
  }

  @action
  setSearchPhrase = (phrase) => this.phrase = phrase;

  fetchEvents = async () => {
    // Reset values if empty search phrase
    if (isEmpty(this.phrase)) {
      this.bets = INIT_VALUES.bets;
      this.sets = INIT_VALUES.sets;
      this.votes = INIT_VALUES.votes;
      this.withdraws = INIT_VALUES.withdraws;
      return;
    }

    this.loading = true;

    // Fetch events and filter by status
    const events = await searchEvents(this.app.graphqlClient, {
      orderBy: [{ field: 'blockNum', direction: SortBy.DESCENDING }],
      searchPhrase: this.phrase,
    });
    this.bets = filter(events, { status: EVENT_STATUS.BETTING });
    this.sets = filter(events, (e) =>
      e.status === EVENT_STATUS.ORACLE_RESULT_SETTING
      || e.status === EVENT_STATUS.OPEN_RESULT_SETTING);
    this.votes = filter(events, { status: EVENT_STATUS.ARBITRATION });
    this.withdraws = filter(events, { status: EVENT_STATUS.WITHDRAWING });

    this.loading = false;
  }
}
