import { TransactionType, TransactionStatus, Phases } from 'constants';
import { satoshiToDecimal } from '../../helpers/utility';

const { PENDING } = TransactionStatus;

/*
* Model for TopicEvents.
* TopicEvents can be thought of as the primary point in an Event. Oracles are stored within TopicEvents.
* All funds bet and voted are stored in a TopicEvent contract, which is why withdrawing takes place here.
*/
export default class Topic {
  address = '' // Contract address
  txid = '' // Transaction ID that this Topic was created
  phase = Phases.WITHDRAWING // Stage the Topic is in. For the UI, users will only see the Withdrawing phase.
  status = '' // Status of the Topic. One of: [CREATED, WITHDRAW]
  blockNum // Block number when this Topic was created.
  creatorAddress = '' // Creator address in Qtum format
  escrowAmount = '' // Escrow amount needed to create the Event
  name = '' // Name of the Event
  options = [] // Option names
  oracles = [] // Oracle objects for the Event
  qtumAmount = [] // Total amount of QTUM voted in all the rounds
  botAmount = [] // Total amount of BOT voted in all the rounds
  resultIdx // Result index of the current result
  transactions = [] // Transaction objects tied to this Event
  version // Current version of the contract. To manage deprecations later.

  // for UI
  isPending = false

  // for invalid option
  localizedInvalid = {};

  constructor(topic, app) {
    Object.assign(this, topic);
    this.app = app;
    this.botAmount = this.botAmount.map(satoshiToDecimal);
    this.qtumAmount = this.qtumAmount.map(satoshiToDecimal);
    this.escrowAmount = satoshiToDecimal(this.escrowAmount);
    this.oracles = this.oracles.map((oracle) => ({
      ...oracle,
      amounts: oracle.amounts.map(satoshiToDecimal),
      consensusThreshold: satoshiToDecimal(oracle.consensusThreshold),
    }));
    const pendingTypes = [TransactionType.WITHDRAW_ESCROW, TransactionType.WITHDRAW];
    this.isPending = this.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING);
    this.url = `/topic/${this.address}`;
    this.isUpcoming = false;
    this.unconfirmed = this.isPending;
    this.localizedInvalid = {
      en: 'Invalid',
      zh: '无效',
      ko: '무효의',
      parse(locale) {
        return this[locale.slice(0, 2)];
      },
    };
  }
}
