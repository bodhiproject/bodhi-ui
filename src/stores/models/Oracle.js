import _ from 'lodash';
import { defineMessages } from 'react-intl';
import { OracleStatus, TransactionType, TransactionStatus, Phases } from 'constants';
import { satoshiToDecimal, getPhase } from '../../helpers/utility';
const { PENDING } = TransactionStatus;
const { RESULT_SETTING, FINALIZING } = Phases;

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  pending: { id: 'str.pending', defaultMessage: 'Pending' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
});


export default class Oracle {
  phase = ''
  status = ''
  txid = ''
  address = ''
  amounts = []
  blockNum
  consensusThreshold = ''
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

    const { APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE, FINALIZE_RESULT, BET } = TransactionType;
    const pendingTypes = {
      BETTING: [BET],
      RESULT_SETTING: [APPROVE_SET_RESULT, SET_RESULT],
      VOTING: [APPROVE_VOTE, VOTE],
      FINALIZING: [FINALIZE_RESULT],
    }[this.phase] || [];
    const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING);
    this.unconfirmed = (!oracle.topicAddress && !oracle.address) || isPending;

    this.isUpcoming = this.phase === RESULT_SETTING && oracle.status === OracleStatus.WaitResult && (app.wallet.addresses.filter((addr) => (addr.address === this.resultSetterQAddress)).length === 0);

    this.buttonText = {
      BETTING: messages.placeBet,
      RESULT_SETTING: messages.setResult,
      VOTING: messages.arbitrate,
      PENDING: messages.pending,
      FINALIZING: messages.finalizeResult,
      WITHDRAWING: messages.withdraw,
    }[this.phase];

    const amount = parseFloat(_.sum(this.amounts).toFixed(2));

    this.amountLabel = this.phase !== FINALIZING ? `${amount} ${oracle.token}` : '';
    this.url = `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`;
    this.endTime = this.phase === RESULT_SETTING ? oracle.resultSetEndTime : oracle.endTime;
  }

  // bet = async (amount) => {
  // }
}
