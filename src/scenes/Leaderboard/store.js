import { observable, action, reaction, toJS } from 'mobx';
import { Token, Routes } from 'constants';

import { allStats, mostBets } from '../../network/graphql/queries';
import { satoshiToDecimal } from '../../helpers/utility';

const INIT_VALUES = {
  eventCount: 0,
  participantCount: 0,
  totalBets: '',
  leaderboardBets: [],
  activeStep: 0,
};

export default class LeaderboardStore {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantCount = INIT_VALUES.participantCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardBets = INIT_VALUES.leaderboardBets
  @observable activeStep = INIT_VALUES.activeStep
  leaderboardLimit = 10
  constructor(app) {
    this.app = app;
    reaction(
      () => toJS(this.app.wallet.addresses) + this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.LEADERBOARD) {
          this.init();
        }
      }
    );
    reaction(
      () => this.activeStep,
      () => this.loadLeaderboard(),
    );
  }

  @action
  init = async () => {
    this.app.ui.location = Routes.LEADERBOARD;
    const res = await allStats(this.app.graphqlClient);
    Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
    await this.loadLeaderboard();
  }

  @action
  loadLeaderboard = async () => {
    const bets = await mostBets(this.app.graphqlClient, { limit: 10, skip: 0 });
    this.leaderboardBets = bets.items;
  }
}
