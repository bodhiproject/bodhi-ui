import _ from 'lodash';
import { Token, EVENT_STATUS } from 'constants';
import { decimalToSatoshi } from '../helpers/utility';

const { NAKA, NBOT } = Token;

export default class Option {
  name
  value
  percent
  isPrevResult
  maxAmount
  amount
  phase
  token
  idx

  constructor(optionName, i, event) {
    this.idx = i;
    this.amount = event.roundBets[i] || 0;
    this.isLast = i === event.results.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = NBOT;
    this.phase = event.phase;
    this.value = `${this.amount} ${this.token}`;
    if (event.token === NAKA) {
      const totalBalance = _.sum(event.amounts);
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
    } else {
      this.isPrevResult = event.currentResultIndex === i;
      this.maxAmount = event.status === EVENT_STATUS.ARBITRATION
        ? event.consensusThreshold - decimalToSatoshi(this.amount) : undefined;

      const threshold = this.isPrevResult ? 0 : event.consensusThreshold;
      this.percent = threshold === 0 ? threshold : _.round((decimalToSatoshi(this.amount) / threshold) * 100);
    }

    this.disabled = this.isPrevResult;
  }

  isExpanded = (selectedOptionIdx) => selectedOptionIdx === this.idx
}
