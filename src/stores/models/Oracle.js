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
  address = '' // Contract address.
  topicAddress = '' // TopicEvent address that created this Oracle.
  txid = '' // Transaction ID that this Oracle was created.
  status = '' // Stage the Oracle is in. Can be one of: [CREATED, VOTING, WAITRESULT, OPENRESULTSET, PENDING, WITHDRAW]
  token = '' // BOT or QTUM
  amounts = [] // QTUM or BOT amounts array for each result index.
  blockNum // Block number when this Oracle was created.
  consensusThreshold = '' // Amount needed to validate a result.
  name = '' // Name of the event.
  optionIdxs = [] // Allowed options to vote on. CentralizedOracle will have all the options. DecentralizedOracle will be missing the index of the previous rounds result.
  options = [] // Option names.
  resultIdx // Result index of current result.
  startTime = '' // CentralizedOracle = betting start time. DecentralizedOracle = arbitration start time. UNIX timestamp.
  endTime = '' // CentralizedOracle = betting end time. DecentralizedOracle = arbitration end time. UNIX timestamp.
  resultSetStartTime = '' // Only for CentralizedOracle. UNIX timestamp result setting start time.
  resultSetEndTime = '' // Only for CentralizedOracle. UNIX timestamp result setting end time.
  resultSetterAddress = '' // Result setter's encoded hex address. Qtum address encoded to hex.
  resultSetterQAddress = '' // Result setters Qtum address.
  transactions = [] // Transaction objects tied to this Event.
  version // Current version of the contract. To manage deprecations later.

  // for UI
  buttonText = '' // Text to show on the CTA button.
  amountLabel = '' // Shows the amount raised on the Event card.
  url = '' // Internal URL for routing within UI.
  @observable txFees = [] // For TxConfirmDialog to show the transactions needed to do when executing.
  @computed get phase() { // BETTING, VOTING, RESULT_SETTING, FINALIZING, WITHDRAWING
    const { token, status } = this;
    const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
    if (QTUM && ['PENDING', 'WITHDRAW', 'CREATED', 'VOTING'].includes(status)) return BETTING;
    if (BOT && ['PENDING', 'VOTING'].includes(status)) return VOTING; // might need WITHDRAW
    if (QTUM && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return RESULT_SETTING;
    if (BOT && status === 'WAITRESULT') return FINALIZING;
    return WITHDRAWING; // only for topic
  }
  @computed get isOpenResultSetting() { // OpenResultSetting means the Result Setter did not set the result in time so anyone can set the result now.
    return this.token === 'QTUM' && this.status === 'OPENRESULTSET';
  }
  @computed get isArchived() { // Archived Oracles mean their purpose has been served. eg. Betting Oracle finished betting round.
    const { token, status } = this;
    const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
    if (QTUM && ['PENDING', 'WITHDRAW'].includes(status)) return true; // BETTING
    if (BOT && ['PENDING', 'WITHDRAW'].includes(status)) return true; // VOTING
    return false;
  }
  @computed get isPending() { // Pending if there is a tx waiting to be accepted by the blockchain. Users can only do one tx at a time.
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
  @computed get unconfirmed() { // Unconfirmed Oracles need to be confirmed by the blockchain before being able to acted on.
    return !this.topicAddress && !this.address;
  }
  @computed get isUpcoming() { // Upcoming is for showing upcoming Events in BOT Court so users don't lose track of an Event while it is in the Result Setting phase.
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
