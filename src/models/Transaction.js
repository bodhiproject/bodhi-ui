import { TransactionType } from 'constants';
import { isNumber } from 'lodash';
import { stringToBN, satoshiToDecimal } from '../helpers/utility';

export default class Transaction {
  txType // One of: [CREATE_EVENT, BET, RESULT_SET, VOTE, WITHDRAW]
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  // Object values of txType will be present. e.g. txType BET will have bet values
  eventName // Name of the event, or the selected result =
  eventAddress // Address of the event
  amount // Amount of this transaction
  txSender // Sender of this transaction
  resultName

  constructor(transaction) {
    Object.assign(this, transaction);
    if (this.txType === TransactionType.CREATE_EVENT) {
      this.eventAddress = transaction.address;
      this.amount = transaction.escrowAmount;
      this.txSender = transaction.ownerAddress;
      this.eventName = transaction.name;
    } else if (this.txType === TransactionType.BET
      || this.txType === TransactionType.VOTE) {
      this.txSender = transaction.betterAddress;
    } else if (this.txType === TransactionType.RESULT_SET) {
      this.txSender = transaction.centralizedOracleAddress;
    } else {
      this.amount = stringToBN(transaction.winningAmount).add(stringToBN(transaction.escrowWithdrawAmount));
      this.amount = this.amount.toString();
      this.txSender = transaction.winnerAddress;
    }
    if (isNumber(this.amount)) {
      // Remove this line when Apollo libaray fixed
      this.amount = this.amount.toFixed(8);
    }
    this.amount = satoshiToDecimal(this.amount);
  }
}
