import { defineMessages } from 'react-intl';
import _ from 'lodash';
import { TransactionType, TransactionStatus, Phases } from '../../constants';
import { satoshiToDecimal } from '../../helpers/utility';
const { Pending } = TransactionStatus;

const messages = defineMessages({
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
});

export default class Topic {
  phase = Phases.withdraw
  status = ''
  txid = ''
  address = ''
  blockNum
  creatorAddress = ''
  escrowAmount = ''
  name = ''
  options = []
  oracles = []
  botAmount = []
  qtumAmount = []
  resultIdx
  transactions = []
  version
  // for UI
  isPending = false // change to this instead of 'unconfirmed'

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
    const pendingTypes = [TransactionType.WithdrawEscrow, TransactionType.Withdraw];
    this.isPending = this.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);

    const totalQTUM = parseFloat(_.sum(this.qtumAmount).toFixed(2));
    const totalBOT = parseFloat(_.sum(this.botAmount).toFixed(2));
    this.amountLabel = `${totalQTUM} QTUM, ${totalBOT} BOT`;
    this.url = `/topic/${this.address}`;
    this.isUpcoming = false;
    this.buttonText = messages.withdraw;
    this.unconfirmed = this.isPending;
  }

  withdraw() {
    /* TODO */
  }
}
