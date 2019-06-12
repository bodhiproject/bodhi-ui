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
    if (event.status !== EVENT_STATUS.ARBITRATION) {
      const totalBalance = _.sum(event.roundBets);
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
      this.userPercent = this.amount === 0 ? this.amount : _.round((event.userRoundBets[i] / this.amount) * this.percent);
    } else {
      this.isPrevResult = event.currentResultIndex === i;
      if (this.isPrevResult) {
        if (event.currentRound === 1) {
          this.value = this.amount;
        } else {
          this.value = event.previousRoundBets[i];
        }
      } else {
        this.value = this.amount;
      }
      this.maxAmount = event.status === EVENT_STATUS.ARBITRATION
        ? event.consensusThreshold - decimalToSatoshi(this.amount) : undefined;

      const threshold = this.isPrevResult ? event.previousConsensusThreshold : event.consensusThreshold;
      this.percent = this.isPrevResult ? 100 : _.round((this.amount / threshold) * 100);
      if (this.isPrevResult) {
        if (event.currentRound === 1) {
          this.userPercent = _.round((event.userRoundBets[i] / event.roundBets[i]) * this.percent);
        } else {
          this.userPercent = _.round((event.previousRoundUserBets[i] / event.previousRoundBets[i]) * this.percent);
        }
      } else {
        this.userPercent = this.amount === 0 ? this.amount : _.round((event.userRoundBets[i] / this.amount) * this.percent);
      }
    }
    if (this.isPrevResult) {
      if (event.currentRound === 1) {
        this.userValue = event.userRoundBets[i];
      } else {
        this.userValue = event.previousRoundUserBets[i];
      }
    } else {
      this.userValue = event.userRoundBets[i];
    }
    this.disabled = this.isPrevResult;
    this.isBetting = event.currentRound === 0;
  }

  isExpanded = (selectedOptionIdx) => selectedOptionIdx === this.idx
}
