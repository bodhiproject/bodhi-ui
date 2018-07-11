import _ from 'lodash';
import { action, computed } from 'mobx';
import { Token, OracleStatus } from 'constants';


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
  idx

  @computed get isExpanded() {
    return this.app.oraclePage.selectedOptionIdx === this.idx;
  }

  constructor(optionName, i, oracle, app) {
    // console.log('NAME: ', optionName);
    // console.log('I: ', i);
    // console.log('ORACLE IN OPTION: ', oracle);
    // console.log('APP: ', app);
    this.app = app;
    this.idx = i;
    this.amount = oracle.amounts[i] || 0;
    this.isLast = i === oracle.options.length - 1;
    this.isFirst = i === 0;
    const totalBalance = _.sum(oracle.amounts);
    this.name = optionName;
    if (oracle.token === Token.QTUM) {
      this.value = `${this.amount} ${oracle.token}`;
      this.percent = totalBalance === 0 ? totalBalance : _.round((this.amount / totalBalance) * 100);
    } else {
      this.isPrevResult = !oracle.optionIdxs.includes(i);
      const threshold = this.isPrevResult ? 0 : oracle.consensusThreshold;
      this.maxAmount = oracle.token === Token.BOT && oracle.status === OracleStatus.Voting
        ? oracle.consensusThreshold - this.amount : undefined;
      this.percent = threshold === 0 ? threshold : _.round((this.amount / threshold) * 100);
      this.isFinalizing = oracle.phase === 'FINALIZING'; // oracle.token === Token.BOT && oracle.status === OracleStatus.WaitResult
    }
    this.disabled = oracle.unconfirmed || (!this.isFinalizing && this.isPrevResult) || (this.isFinalizing && !this.isPrevResult);
  }

  @action
  toggleExpansion = () => {
    const { oraclePage } = this.app;
    if (oraclePage.selectedOptionIdx == this.idx) { // eslint-disable-line
      oraclePage.selectedOptionIdx = -1;
    } else {
      oraclePage.selectedOptionIdx = this.idx;
    }
  }
}
