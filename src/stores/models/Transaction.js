import _ from 'lodash';

import { Token, TransactionType } from 'constants';
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

  constructor(transaction) {
    Object.assign(this, transaction);
    this.gasLimit = Number(this.gasLimit);
    this.gasPrice = Number(this.gasPrice);
    this.fee = gasToQtum(this.gasUsed);

    if (this.token === Token.BOT) {
      const { ApproveCreateEvent, ApproveSetResult, ApproveVote } = TransactionType;
      if (_.includes([ApproveCreateEvent, ApproveSetResult, ApproveVote], this.type)) {
        // Don't show the amount for any approves
        this.amount = undefined;
      } else {
        this.amount = satoshiToDecimal(this.amount);
      }
    }
  }
}
