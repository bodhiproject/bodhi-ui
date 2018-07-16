import _ from 'lodash';
import { observable, computed } from 'mobx';
import { defineMessages } from 'react-intl';
import { OracleStatus, TransactionType, TransactionStatus, Phases } from 'constants';
import { satoshiToDecimal } from '../../helpers/utility';
import Option from './Option';
const { BETTING, VOTING, RESULT_SETTING, FINALIZING, WITHDRAWING } = Phases;

const { PENDING } = TransactionStatus;

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  pending: { id: 'str.pending', defaultMessage: 'Pending' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
  archive: { id: 'bottomButtonText.archived', defaultMessage: 'Archived' },
});


export default class Oracle {
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
  amountLabel = ''
  url = ''
  token = '' // BOT or QTUM
  address = ''
  topicAddress = ''
  @observable txFees = []
  @computed get phase() { // BETTING, VOTING, RESULT_SETTING, FINALIZING, WITHDRAWING
    const { token, status } = this;
    const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
    if (QTUM && ['PENDING', 'WITHDRAW', 'CREATED', 'VOTING'].includes(status)) return BETTING;
    if (BOT && ['PENDING', 'WITHDRAW', 'VOTING'].includes(status)) return VOTING;
    if (QTUM && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return RESULT_SETTING;
    if (BOT && status === 'WAITRESULT') return FINALIZING;
    return WITHDRAWING; // only for topic
  }
  @computed get isArchived() {
    const { token, status } = this;
    const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
    if (QTUM && ['PENDING', 'WITHDRAW'].includes(status)) return true; // BETTING
    if (BOT && ['PENDING', 'WITHDRAW'].includes(status)) return true; // VOTING
    return false;
  }
  @computed get isPending() {
    const { token, status, transactions } = this;
    const [QTUM] = [token === 'QTUM'];
    const { APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE, FINALIZE_RESULT, BET } = TransactionType;
    const pendingTypes = {
      BETTING: [BET],
      RESULT_SETTING: [APPROVE_SET_RESULT, SET_RESULT],
      VOTING: [APPROVE_VOTE, VOTE],
      FINALIZING: [FINALIZE_RESULT],
    }[this.phase];
    const isPending = transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING); // eslint-disable-line
    if (isPending) return true;
    if (QTUM && status === 'CREATED') return true; // BETTING (used to be UNCONFIRMED)
    return false;
  }
  @computed get unconfirmed() {
    return !this.topicAddress && !this.address;
  }
  @computed get isUpcoming() {
    return (
      this.phase === RESULT_SETTING
      && this.status === OracleStatus.WAIT_RESULT
      && (this.app.wallet.addresses.filter(({ address }) => (address === this.resultSetterQAddress)).length === 0)
    );
  }

  constructor(oracle, app) {
    Object.assign(this, oracle);
    this.app = app;
    this.amounts = oracle.amounts.map(satoshiToDecimal);
    this.consensusThreshold = satoshiToDecimal(oracle.consensusThreshold);

    this.buttonText = { // TODO: will move into each oracle component
      BETTING: messages.placeBet,
      RESULT_SETTING: messages.setResult,
      VOTING: messages.arbitrate,
      FINALIZING: messages.finalizeResult,
      WITHDRAWING: messages.withdraw,
    }[this.phase];
    this.buttonText = this.isArchived ? messages.archive : this.buttonText;
    const amount = parseFloat(_.sum(this.amounts).toFixed(2));

    this.amountLabel = this.phase !== FINALIZING ? `${amount} ${oracle.token}` : ''; // TODO: will move into Finalize Oracle component
    this.url = `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`;
    this.endTime = this.phase === RESULT_SETTING ? oracle.resultSetEndTime : oracle.endTime;

    this.options = oracle.options.map((option, i) => new Option(option, i, this, app));
  }
}
