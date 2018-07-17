import _ from 'lodash';

import { Token, TransactionType } from 'constants';
import { gasToQtum, satoshiToDecimal } from '../../helpers/utility';
const { APPROVE_CREATE_EVENT, APPROVE_SET_RESULT, APPROVE_VOTE, BET, VOTE, SET_RESULT, FINALIZE_RESULT } = TransactionType;

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
    const { topic, type, optionIdx } = transaction;
    if (topic && [APPROVE_SET_RESULT, APPROVE_VOTE, BET, VOTE, SET_RESULT, FINALIZE_RESULT].includes(type)) {
      this.name = topic.options[optionIdx];
    }

    if (this.token === Token.BOT) {
      if (_.includes([APPROVE_CREATE_EVENT, APPROVE_SET_RESULT, APPROVE_VOTE], this.type)) {
        // Don't show the amount for any approves
        this.amount = undefined;
      } else {
        this.amount = satoshiToDecimal(this.amount);
      }
    }
  }
}
