import { isEmpty, filter } from 'lodash';
import { observable, action, reaction } from 'mobx';
import { EVENT_STATUS, SortBy } from 'constants';
import { searchEvents } from '../../network/graphql/queries';

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
        if (this.app.ui.searchBarMode
          && this.app.global.online
          && !isEmpty(this.phrase)) {
          this.fetchEvents();
        }
      }
    );
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
