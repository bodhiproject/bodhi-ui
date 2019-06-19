import { map, isUndefined, isNull } from 'lodash';
import { EVENT_STATUS } from 'constants';
import { satoshiToDecimal } from '../helpers/utility';
import Option from './Option';
import BetOption from './BetOption';

export default class MultipleResultsEvent {
  txid // Transaction ID returned when the event confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when the event was created
  block // Block info returned when event confirmed
  address // Contract address returned when confirmed
  ownerAddress // Owner of the event
  version // Current version of the contract
  name // Name
  results // Results
  numOfResults // Number of results
  centralizedOracle // Result setter
  betStartTime // Unix timestamp of the bet start time
  betEndTime // Unix timestamp of the bet end time
  resultSetStartTime // Unix timestamp of the result set start time
  resultSetEndTime // Unix timestamp of the result set end time
  escrowAmount // Escrow amount deposited in decimals
  arbitrationLength // Length of arbitration rounds in seconds
  thresholdPercentIncrease // Percentage of increase for consensus threshold
  arbitrationRewardPercentage // Percentage of betting round that goes to arbitration winners
  currentRound // Current round of Oracle
  currentResultIndex // Current winning result index
  consensusThreshold // Current consensus threshold for the round in decimals
  previousConsensusThreshold // Previous consensus threshold for the round in decimals
  arbitrationEndTime // Timestamp of the end of the arbitration round
  status // Event status. One of: [CREATED, PRE_BETTING, BETTING, PRE_RESULT_SETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING]
  language // Language of the event
  pendingTxs // Counts of pending txs for the address passed in pendingTxsAddress param
  roundBets // Array of bets for the current round returned if includeRoundBets: true
  userRoundBets
  totalBets // Total amount of bets for this event in decimals
  betRoundBets
  totalBetRoundBets
  previousRoundUserBets
  previousRoundBets
  withdrawnList // List of who have withdrawn

  // UI-specific vars
  localizedInvalid // for invalid option
  url // URL to link to for the router

  constructor(event) {
    Object.assign(this, event);
    this.escrowAmount = satoshiToDecimal(event.escrowAmount);
    this.consensusThreshold = satoshiToDecimal(event.consensusThreshold);
    this.previousConsensusThreshold = event.previousConsensusThreshold && satoshiToDecimal(event.previousConsensusThreshold);
    this.roundBets = map(event.roundBets && event.roundBets.singleTotalRoundBets[this.currentRound], (bets) => satoshiToDecimal(bets));
    this.userRoundBets = map(event.roundBets && event.roundBets.singleUserRoundBets[this.currentRound], (bets) => satoshiToDecimal(bets));
    this.betRoundBets = map(event.roundBets && event.roundBets.singleTotalRoundBets[0], (bets) => satoshiToDecimal(bets));
    this.userBetRoundBets = map(event.roundBets && event.roundBets.singleUserRoundBets[0], (bets) => satoshiToDecimal(bets));
    this.previousRoundBets = map(event.roundBets && event.roundBets.singleTotalRoundBets[this.currentRound - 1], (bets) => satoshiToDecimal(bets));
    this.previousRoundUserBets = map(event.roundBets && event.roundBets.singleUserRoundBets[this.currentRound - 1], (bets) => satoshiToDecimal(bets));

    this.totalBets = satoshiToDecimal(event.totalBets);
    this.localizedInvalid = {
      en: 'Invalid',
      zh: '无效',
      ko: '무효의',
      parse(locale) {
        return this[locale.slice(0, 2)];
      },
    };
    this.results = event.results.map((result, i) => new Option(result, i, this));
    this.betResults = event.results.map((result, i) => new BetOption(result, i, this));
    this.url = `/event/${this.address ? this.address : this.txid}`;
    if (isUndefined(this.withdrawnList) || isNull(this.withdrawnList)) this.withdrawnList = [];
  }

  isPending = () => Boolean(!!this.pendingTxs && this.pendingTxs.total && this.pendingTxs.total > 0);

  isOpenResultSetting = () => this.status === EVENT_STATUS.OPEN_RESULT_SETTING;

  getEndTime = () => {
    switch (this.status) {
      case EVENT_STATUS.CREATED: return null;
      case EVENT_STATUS.PRE_BETTING:
      case EVENT_STATUS.BETTING: return this.betEndTime;
      case EVENT_STATUS.PRE_RESULT_SETTING:
      case EVENT_STATUS.ORACLE_RESULT_SETTING: return this.resultSetEndTime;
      case EVENT_STATUS.OPEN_RESULT_SETTING: return this.resultSetEndTime;
      case EVENT_STATUS.ARBITRATION: return this.arbitrationEndTime;
      case EVENT_STATUS.WITHDRAWING: return this.arbitrationEndTime;
      default: throw Error(`Invalid status: ${this.status}`);
    }
  }
}
