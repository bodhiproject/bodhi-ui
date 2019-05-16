import { observable, action, reaction, toJS } from 'mobx';
import { Token, Routes } from 'constants';

import { allStats, mostBets } from '../../network/graphql/queries';
import { satoshiToDecimal } from '../../helpers/utility';

const INIT_VALUES = {
  eventCount: 0,
  participantsCount: 0,
  totalBets: '',
  leaderboardBets: [],
  activeStep: 0,
};

const paras = [Token.NAKA, Token.NBOT];

export default class LeaderboardStore {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantsCount = INIT_VALUES.participantsCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardBets = INIT_VALUES.leaderboardBets
  @observable activeStep = INIT_VALUES.activeStep
  leaderboardLimit = 10
  constructor(app) {
    this.app = app;
    reaction(
      () => toJS(this.app.wallet.addresses) + this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.ui.location === Routes.LEADERBOARD) {
          this.refreshStats();
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
    Object.assign(this, INIT_VALUES);
    this.refreshStats();
  }

  @action
  refreshStats = async () => {
    this.app.ui.location = Routes.LEADERBOARD;
    const { graphqlClient } = this.app;
    const res = await allStats(graphqlClient);
    Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
    // await this.loadLeaderboard();
  }

  @action
  loadLeaderboard = async () => {
    const { graphqlClient } = this.app;
    const { items } = await mostBets(graphqlClient, { filters: undefined, orderBy: undefined, limit: 10, skip: 0 });
    this.leaderboardBets = items;
  }
}
