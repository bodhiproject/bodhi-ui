import { Token, TransactionType } from '../../constants';
import { gasToQtum, satoshiToDecimal } from '../../helpers/utility';

export default class Transaction {
  type = ''
  txid = ''
  status = ''
  createdTime = ''
  blockNum = 0
  blockTime = ''
  gasLimit = 0
  gasPrice = 0
  gasUsed = 0
  version = 0
  senderAddress = ''
  receiverAddress = ''
  topicAddress = ''
  oracleAddress = ''
  name = ''
  optionIdx = 0
  token = ''
  amount = ''
  topic

  constructor(transaction, app) {
    Object.assign(this, transaction);
    this.app = app;
    this.gasLimit = Number(this.gasLimit);
    this.gasPrice = Number(this.gasPrice);
    this.fee = gasToQtum(this.gasUsed);

    if (this.token === Token.Bot) {
      if (this.type !== TransactionType.ApproveCreateEvent
        && this.type !== TransactionType.ApproveSetResult
        && this.type !== TransactionType.ApproveVote) {
        this.amount = satoshiToDecimal(this.amount);
      } else {
        // Don't show the amount for any approves
        this.amount = undefined;
      }
    }
  }
}
