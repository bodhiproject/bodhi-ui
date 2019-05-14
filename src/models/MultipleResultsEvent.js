import { EVENT_STATUS } from 'constants';
import { satoshiToDecimal } from '../../helpers/utility';

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
  arbitrationEndTime // Timestamp of the end of the arbitration round
  totalBets // Total amount of all bets in decimals
  status // Event status. One of: [CREATED, BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING]
  language // Language of the event
  pendingTxs // Counts of pending txs for the address passed in pendingTxsAddress param

  // UI-specific vars
  localizedInvalid // for invalid option

  constructor(event, app) {
    Object.assign(this, event);
    this.app = app;
    this.escrowAmount = satoshiToDecimal(event.escrowAmount);
    this.totalBets = satoshiToDecimal(event.totalBets);
    this.localizedInvalid = {
      en: 'Invalid',
      zh: '无效',
      ko: '무효의',
      parse(locale) {
        return this[locale.slice(0, 2)];
      },
    };
  }

  isPending() {
    return this.pendingTxs.total && this.pendingTxs.total > 0;
  }

  isUpcoming = (address) => this.status === EVENT_STATUS.ORACLE_RESULT_SETTING
    && address !== this.ownerAddress;
}
