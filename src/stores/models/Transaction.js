import _ from 'lodash';

import { Token, TransactionType } from 'constants';
import { gasToQtum, satoshiToDecimal } from '../../helpers/utility';

const { APPROVE_CREATE_EVENT, APPROVE_SET_RESULT, APPROVE_VOTE, BET, VOTE, SET_RESULT, FINALIZE_RESULT } = TransactionType;


/*
* Model for Transactions.
* Represents pending actions to contracts that are awaiting acceptance by the blockchain.
* Transactions are currently local to each user's machine.
*/
export default class Transaction {
  type = '' // One of: [CREATEEVENT, APPROVECREATEEVENT, BET, SETRESULT, APPROVESETRESULT, VOTE, APPROVEVOTE, FINALIZERESULT, WITHDRAW, WITHDRAWESCROW, TRANSFER]
  txid = '' // Transaction ID assigned by the blockchain.
  status = '' // One of: [PENDING, SUCCESS, FAIL]
  createdTime = '' // UNIX timestamp when Transaction was created.
  blockNum = 0 // Block number when Transaction was recorded on blockchain.
  blockTime = '' // Block timestamp for blockNum.
  gasLimit = 0 // Gas limit set.
  gasPrice = 0 // Gas price set.
  gasUsed = 0 // Actual gas used.
  senderAddress = '' // Sender's address.
  receiverAddress = '' // Receiver's address. Only used for TRANSFER types.
  topicAddress = '' // Topic contract address associated with Transaction.
  oracleAddress = '' // Oracle contract address associated with Transaction.
  name = '' // Nave of the event.
  optionIdx = 0 // Result index used for Transaction. eg. For a bet, this would be the result index the user bet on.
  token = '' // Token type used for Transaction. QTUM for BET. BOT for VOTE.
  amount = '' // Amount of token used.
  topic // The Topic object associated with the Transaction.
  version = 0 // Current version of the contract. To manage deprecations later.

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
