import _ from 'lodash';
import { action, computed } from 'mobx';
import { Token, OracleStatus } from 'constants';

const { QTUM, BOT } = Token;

export default class Option {
  name
  value
  percent
  isPrevResult
  isFinalizing
  maxAmount
  amount
  phase
  unconfirmed
  token
  idx

  @computed get isExpanded() {
    return this.app.eventPage.selectedOptionIdx === this.idx;
  }

  constructor(optionName, i, oracle, app) {
    this.app = app;
    this.idx = i;
    this.amount = oracle.amounts[i] || 0;
    this.isLast = i === oracle.options.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = oracle.token;
    this.phase = oracle.phase;

    if (oracle.token === QTUM) {
      this.value = `${this.amount} ${this.token}`;

      const totalBalance = _.sum(oracle.amounts);
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
    } else {
      this.isPrevResult = !oracle.optionIdxs.includes(i);
      this.maxAmount = oracle.token === BOT && oracle.status === OracleStatus.Voting
        ? oracle.consensusThreshold - this.amount : undefined;

      const threshold = this.isPrevResult ? 0 : oracle.consensusThreshold;
      this.percent = threshold === 0 ? threshold : _.round((this.amount / threshold) * 100);

      // oracle.token === Token.BOT && oracle.status === OracleStatus.WaitResult
      this.isFinalizing = this.phase === 'FINALIZING';
    }

    this.disabled = oracle.unconfirmed
      || (!this.isFinalizing && this.isPrevResult)
      || (this.isFinalizing && !this.isPrevResult);
  }

  @action
  toggleExpansion = () => {
    const { eventPage } = this.app;
    if (eventPage.selectedOptionIdx == this.idx) { // eslint-disable-line
      eventPage.selectedOptionIdx = -1;
    } else {
      eventPage.selectedOptionIdx = this.idx;
    }
  }
}
