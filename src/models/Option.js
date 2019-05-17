import _ from 'lodash';
import { action, computed } from 'mobx';
import { Token, OracleStatus } from 'constants';

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

  @computed get isExpanded() {
    console.log('123321', this.app);
    return this.app.eventPage.selectedOptionIdx === this.idx;
  }

  constructor(optionName, i, oracle, app) {
    console.log('TCL: Option -> constructor -> app', app);
    this.app = app;
    this.idx = i;
    this.amount = oracle.roundBets[i] || 0;
    this.isLast = i === oracle.results.length - 1;
    this.isFirst = i === 0;
    this.name = optionName;
    this.token = NBOT;
    this.phase = oracle.phase;
    this.value = `${this.amount} ${this.token}`;
    if (oracle.token === NAKA) {
      const totalBalance = _.sum(oracle.amounts);
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
    } else {
      this.isPrevResult = oracle.currentResultIndex === i;
      this.maxAmount = oracle.token === NBOT && oracle.status === OracleStatus.VOTING
        ? oracle.consensusThreshold - this.amount : undefined;

      const threshold = this.isPrevResult ? 0 : oracle.consensusThreshold;
      this.percent = threshold === 0 ? threshold : _.round((this.amount / threshold) * 100);
    }

    this.disabled = this.isPrevResult;
    console.log('TCL: Option -> constructor -> this.disabled', this.disabled);
  }

  @action
  toggleExpansion = () => {
    const { eventPage } = this.app;
    console.log('123aqq', this.idx);
    if (eventPage.selectedOptionIdx == this.idx) { // eslint-disable-line
      eventPage.selectedOptionIdx = -1;
    } else {
      eventPage.selectedOptionIdx = this.idx;
    }
  }
}
