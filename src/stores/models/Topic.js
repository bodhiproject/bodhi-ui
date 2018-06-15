import { observable, computed } from 'mobx';
import { TransactionType, TransactionStatus } from '../../constants';
const { Pending } = TransactionStatus;


export default class Topic {
  @observable phase = ''
  @observable status = ''
  txid = ''
  address = ''
  blockNum
  botAmount = []
  creatorAddress = ''
  escrowAmount = ''
  name = ''
  options = []
  oracles = []
  qtumAmount = []
  resultIdx
  transactions = []
  version
  // for UI
  @computed get pending() {
    const pendingTypes = [TransactionType.WithdrawEscrow, TransactionType.Withdraw];
    return this.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
  }

  constructor(topic, app) {
    Object.assign(this, topic);
    this.app = app;
  }
}
