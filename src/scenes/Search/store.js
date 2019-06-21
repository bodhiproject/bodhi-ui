import { isEmpty, filter, debounce } from 'lodash';
import { observable, action, reaction } from 'mobx';
import logger from 'loglevel';
import { EVENT_STATUS, SortBy } from 'constants';
import { searchEvents } from '../../network/graphql/queries';

const INIT_VALUES = {
  phrase: '',
  loading: false,
  tabIdx: 0,
  events: [],
  bets: [],
  sets: [],
  votes: [],
  withdraws: [],
};

export default class SearchStore {
  @observable phrase = INIT_VALUES.phrase;
  @observable loading = INIT_VALUES.loading;
  @observable tabIdx = INIT_VALUES.tabIdx;
  @observable events = INIT_VALUES.events;
  @observable bets = INIT_VALUES.bets;
  @observable sets = INIT_VALUES.sets;
  @observable votes = INIT_VALUES.votes;
  @observable withdraws = INIT_VALUES.withdraws;

  constructor(app) {
    this.app = app;

    reaction(
      () => this.app.global.online,
      () => {
        if (this.app.ui.searchBarMode && this.app.global.online) {
          this.fetchEvents();
        }
      }
    );
  }

  @action
  onTabChange = (tabIdx) => this.tabIdx = tabIdx;

  @action
  setSearchPhrase = (phrase) => this.phrase = phrase;

  @action
  resetEvents = () => {
    this.events = INIT_VALUES.events;
    this.bets = INIT_VALUES.bets;
    this.sets = INIT_VALUES.sets;
    this.votes = INIT_VALUES.votes;
    this.withdraws = INIT_VALUES.withdraws;
  }

  fetchEvents = async () => {
    // Reset values if empty search phrase
    if (isEmpty(this.phrase)) {
      this.resetEvents();
      return;
    }

    this.loading = true;

    // Fetch events and filter by status
    const { graphqlClient } = this.app;
    const roundBetsAddress = this.app.wallet.currentAddress || null;
    try {
      this.events = await searchEvents(graphqlClient, {
        orderBy: [{ field: 'blockNum', direction: SortBy.DESCENDING }],
        searchPhrase: this.phrase,
        includeRoundBets: true,
        roundBetsAddress,
      });
      this.bets = filter(this.events, (event) => [EVENT_STATUS.PRE_BETTING, EVENT_STATUS.BETTING].includes(event.status));
      this.sets = filter(this.events, (e) =>
        e.status === EVENT_STATUS.PRE_RESULT_SETTING
        || e.status === EVENT_STATUS.ORACLE_RESULT_SETTING
        || e.status === EVENT_STATUS.OPEN_RESULT_SETTING);
      this.votes = filter(this.events, { status: EVENT_STATUS.ARBITRATION });
      this.withdraws = filter(this.events, { status: EVENT_STATUS.WITHDRAWING });
    } catch (err) {
      logger.error('SearchStore.fetchEvents', err);
      this.resetEvents();
    }

    this.loading = false;
  }

  debounceFetchEvents = debounce(this.fetchEvents, 1500);
}
