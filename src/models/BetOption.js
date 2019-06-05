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

  constructor(optionName, i, event) {
    this.idx = i;
    this.amount = event.betRoundBets[i] || 0;
    this.isLast = i === event.results.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = NBOT;
    this.phase = event.phase;
    this.value = `${this.amount} ${this.token}`;
    const totalBalance = _.sum(event.betRoundBets);
    this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
    this.userPercent = this.amount === 0 ? this.amount : _.round((event.userBetRoundBets[i] / this.amount) * this.percent);
    this.userValue = event.userBetRoundBets[i];
    this.disabled = true;
  }

  isExpanded = (selectedOptionIdx) => false
}
