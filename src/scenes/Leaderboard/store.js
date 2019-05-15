import { observable, action, reaction, toJS } from 'mobx';
import { Token, Routes } from 'constants';

import { queryLeaderboardStats, queryMostVotes } from '../../network/graphql/queries';
import { satoshiToDecimal } from '../../helpers/utility';

const INIT_VALUES = {
  eventCount: 0,
  participantsCount: 0,
  totalNBOT: '',
  totalNAKA: '',
  leaderboardVotes: [],
  activeStep: 0,
};

const paras = [Token.NAKA, Token.NBOT];

export default class LeaderboardStore {
  @observable eventCount = INIT_VALUES.eventCount
  @observable participantsCount = INIT_VALUES.participantsCount
  @observable totalNBOT = INIT_VALUES.totalNBOT
  @observable totalNAKA = INIT_VALUES.totalNAKA
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
    // this.app.ui.location = Routes.LEADERBOARD;
    // const res = await queryLeaderboardStats();
    // Object.assign(this, res, { totalNBOT: satoshiToDecimal(res.totalNbot), totalNAKA: satoshiToDecimal(res.totalNAKA) });
    // await this.loadLeaderboard();
  }

  @action
  loadLeaderboard = async () => {
    // const { votes } = await queryMostVotes([{ token: paras[this.activeStep] }], null, 10, 0);
    // this.leaderboardVotes = votes;
  }
}
