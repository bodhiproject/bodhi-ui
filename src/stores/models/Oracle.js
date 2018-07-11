import _ from 'lodash';
import { observable } from 'mobx';
import { defineMessages } from 'react-intl';
import { OracleStatus, TransactionType, TransactionStatus, Phases } from 'constants';
import { satoshiToDecimal, getPhase } from '../../helpers/utility';
import Option from './Option';
const { Pending } = TransactionStatus;
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

  constructor(oracle, app) {
    Object.assign(this, oracle);
    this.app = app;
    this.phase = getPhase(oracle);
    this.amounts = oracle.amounts.map(satoshiToDecimal);
    this.consensusThreshold = satoshiToDecimal(oracle.consensusThreshold);

    const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
    const pendingTypes = {
      BETTING: [Bet],
      RESULT_SETTING: [ApproveSetResult, SetResult],
      VOTING: [ApproveVote, Vote],
      FINALIZING: [FinalizeResult],
    }[this.phase] || [];
    this.isPending = this.app.oraclePage.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
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
