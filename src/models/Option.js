import _ from 'lodash';
import { Token, EVENT_STATUS } from 'constants';
import { decimalToSatoshi } from '../helpers/utility';

const { NBOT } = Token;

export default class Option {
  name
  value
  userValue
  percent
  isPrevResult
  maxAmount
  amount
  phase
  token
  idx
  isBetting

  constructor(optionName, i, event) {
    this.idx = i;
    this.amount = event.roundBets[i] || 0;
    this.isLast = i === event.results.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = NBOT;
    this.phase = event.phase;
    this.value = this.amount;
    if (event.currentRound === 0) {
      const totalBalance = _.sum(event.roundBets);
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
      this.userPercent = this.amount === 0 ? this.amount : _.round((event.userRoundBets[i] / this.amount) * this.percent);
      this.userValue = event.userRoundBets[i];
    } else {
      this.isPrevResult = event.currentResultIndex === i;
      if (this.isPrevResult) {
        this.percent = 100;
        if (event.currentRound === 1) {
          this.value = this.amount;
          this.userPercent = _.round((event.userRoundBets[i] / event.roundBets[i]) * this.percent);
          this.userValue = event.userRoundBets[i];
        } else {
          this.value = event.previousRoundBets[i];
          this.userPercent = _.round((event.previousRoundUserBets[i] / event.previousRoundBets[i]) * this.percent);
          this.userValue = event.previousRoundUserBets[i];
        }
      } else {
        const threshold = event.consensusThreshold;
        this.value = this.amount;
        this.percent = _.round((this.amount / threshold) * 100);
        this.userPercent = this.amount === 0 ? this.amount : _.round((event.userRoundBets[i] / this.amount) * this.percent);
        this.userValue = event.userRoundBets[i];
      }
      this.maxAmount = event.status === EVENT_STATUS.ARBITRATION
        ? event.consensusThreshold - decimalToSatoshi(this.amount) : undefined;
    }

    this.disabled = this.isPrevResult;
    this.isBetting = event.currentRound === 0;
  }

  isExpanded = (selectedOptionIdx) => selectedOptionIdx === this.idx
}
