import { observable, action, reaction, toJS } from 'mobx';
import { Token, Routes } from 'constants';

import { allStats, queryMostVotes } from '../../network/graphql/queries';
import { satoshiToDecimal } from '../../helpers/utility';

const INIT_VALUES = {
  eventCount: 0,
  participantCount: 0,
  totalBets: '',
  leaderboardVotes: [],
  activeStep: 0,
};

const paras = [Token.NAKA, Token.NBOT];

export default class LeaderboardStore {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantCount = INIT_VALUES.participantCount
  @observable totalBets = INIT_VALUES.totalBets
  @observable leaderboardVotes = INIT_VALUES.leaderboardVotes
  @observable activeStep = INIT_VALUES.activeStep
  leaderboardLimit = 10
  constructor(app) {
    this.app = app;
    reaction(
      () => toJS(this.app.wallet.addresses) + this.app.global.syncBlockNum + this.app.global.online,
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
    // Object.assign(this, INIT_VALUES);
    this.app.ui.location = Routes.LEADERBOARD;
    const res = await allStats(this.app.graphqlClient);
    Object.assign(this, res, { totalBets: satoshiToDecimal(res.totalBets) });
    // await this.loadLeaderboard();
  }

  @action
  loadLeaderboard = async () => {
    // const { votes } = await queryMostVotes([{ token: paras[this.activeStep] }], null, 10, 0);
    // this.leaderboardVotes = votes;
  }
}
