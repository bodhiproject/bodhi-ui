import _ from 'lodash';
import { observable, computed } from 'mobx';
import { defineMessages } from 'react-intl';
import { OracleStatus, TransactionType, TransactionStatus, Phases } from 'constants';
import { satoshiToDecimal, getPhase } from '../../helpers/utility';
import Option from './Option';
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
  @observable phase = ''
  status = ''
  txid = ''
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
  transactions = []
  version
  // for UI
  buttonText = ''
  unconfirmed = false
  isPending = false
  amountLabel = ''
  url = ''
  token = '' // BOT or QTUM
  address = ''
  topicAddress = ''
  @observable txFees = []
  @computed get selectedOption() {
    return this.options[this.app.oraclePage.selectedOptionIdx] || {};
  }

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
    this.isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING);
    this.unconfirmed = (!oracle.topicAddress && !oracle.address);

    this.isUpcoming = this.phase === RESULT_SETTING && oracle.status === OracleStatus.WaitResult && (app.wallet.addresses.filter(({ address }) => (address === this.resultSetterQAddress)).length === 0);

    this.buttonText = { // TODO: will move into each oracle component
      BETTING: messages.placeBet,
      RESULT_SETTING: messages.setResult,
      VOTING: messages.arbitrate,
      PENDING: messages.pending,
      FINALIZING: messages.finalizeResult,
      WITHDRAWING: messages.withdraw,
      UNCONFIRMED: { id: 'str.unconfirmed' },
    }[this.phase];

    const amount = parseFloat(_.sum(this.amounts).toFixed(2));

    this.amountLabel = this.phase !== FINALIZING ? `${amount} ${oracle.token}` : ''; // TODO: will move into Finalize Oracle component
    this.url = `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`;
    this.endTime = this.phase === RESULT_SETTING ? oracle.resultSetEndTime : oracle.endTime;

    this.options = oracle.options.map((option, i) => new Option(option, i, this, app));
  }
}
