import _ from 'lodash';
import { defineMessages } from 'react-intl';
import { OracleStatus, TransactionType, TransactionStatus, Phases } from '../../constants';
import { satoshiToDecimal } from '../../helpers/utility';
const { Pending } = TransactionStatus;
const { bet, vote, setResult, finalize, withdraw } = Phases;

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
});

/**
 * Takes an oracle object and returns which phase it is in.
 * @param {oracle} oracle
 */
const getPhase = ({ token, status }) => {
  const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
  if (QTUM && ['VOTING', 'CREATED'].includes(status)) return bet;
  if (BOT && status === 'VOTING') return vote;
  if (QTUM && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return setResult;
  if (BOT && status === 'WAITRESULT') return finalize;
  if (((BOT || QTUM) && status === 'WITHDRAW') || (QTUM && status === 'PENDING')) return withdraw;
  throw Error(`Invalid Phase determined by these -> TOKEN: ${token} STATUS: ${status}`);
};

export default class Oracle {
  phase = ''
  status = ''
  txid = ''
  address = ''
  amounts = []
  blockNum
  consensusThreshold = '10000000000'
  startTime = ''
  endTime = ''
  name = ''
  optionIdxs = []
  options = []
  resultIdx
  resultSetStartTime = ''
  resultSetEndTime = ''
  resultSetterAddress = ''
  resultSetterQAddress = ''
  token = '' // BOT or QTUM
  topicAddress = ''
  transactions = []
  version
  // for UI
  buttonText = ''
  unconfirmed = false // switch to isPending
  amountLabel = ''
  url = ''

  constructor(oracle, app) {
    Object.assign(this, oracle);
    this.app = app;
    this.phase = getPhase(oracle);
    this.amounts = oracle.amounts.map(satoshiToDecimal);
    this.consensusThreshold = satoshiToDecimal(oracle.consensusThreshold);

    const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
    const pendingTypes = {
      bet: [Bet],
      vote: [ApproveVote, Vote],
      setResult: [ApproveSetResult, SetResult],
      finalize: [FinalizeResult],
    }[this.phase] || [];
    const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
    this.unconfirmed = (!oracle.topicAddress && !oracle.address) || isPending;

    this.isUpcoming = this.phase === vote && oracle.status === OracleStatus.WaitResult;

    this.buttonText = {
      bet: messages.placeBet,
      setResult: messages.setResult,
      vote: messages.arbitrate,
      finalize: messages.finalizeResult,
      withdraw: messages.withdraw,
    }[this.phase];

    const amount = parseFloat(_.sum(this.amounts).toFixed(2));

    this.amountLabel = this.phase === finalize ? `${amount} ${oracle.token}` : '';
    this.url = `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`;
    this.endTime = this.phase === setResult ? oracle.resultSetEndTime : oracle.endTime;
  }
}
