import { sum, round } from 'lodash';
import { Token } from 'constants';

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
  odds

  constructor(optionName, i, event) {
    this.idx = i;
    this.amount = event.betRoundBets[i] || 0;
    this.isLast = i === event.results.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = NBOT;
    this.phase = event.phase;
    this.value = this.amount;
    const totalBalance = sum(event.betRoundBets);
    this.percent = totalBalance === 0 ? totalBalance : round((this.amount / totalBalance) * 100, 2);
    this.userPercent = this.amount === 0 ? this.amount : round((event.userBetRoundBets[i] / this.amount) * this.percent, 2);
    this.userValue = event.userBetRoundBets[i];
    this.disabled = true;
    this.isBetting = true;
    if (this.value === 0) this.odds = undefined;
    else {
      const betRoundSum = sum(event.betRoundBets);
      this.odds = 1 + (((betRoundSum - event.betRoundBets[i]) * (1 - (event.arbitrationRewardPercentage / 100))) / this.value);
    }
  }

  isExpanded = () => false
}
