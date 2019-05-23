import { TransactionType } from 'constants';
import { stringToBN, satoshiToDecimal } from '../../../../helpers/utility';

export default class Transaction {
  txType // One of: [CREATE_EVENT, BET, RESULT_SET, VOTE, WITHDRAW]
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  // Object values of txType will be present. e.g. txType BET will have bet values
  name // Name of the event, or the selected result =
  eventAddress // Address of the event
  amount // Amount of this transaction

  constructor(transaction) {
    Object.assign(this, transaction);
    if (this.txType === TransactionType.CREATE_EVENT) {
      this.eventAddress = transaction.address;
      this.amount = transaction.escrowAmount;
    } else if (this.txType === TransactionType.BET
      || this.txType === TransactionType.RESULT_SET
      || this.txType === TransactionType.VOTE) {
      this.name = transaction.resultIndex;
    } else {
      this.amount = stringToBN(transaction.winningAmount).add(stringToBN(transaction.escrowWithdrawAmount));
      this.amount = this.amount.toString();
      this.name = 'Withdraw';
    }
  }
}
