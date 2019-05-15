export default class Transaction {
  txType // One of: [CREATE_EVENT, BET, RESULT_SET, VOTE, WITHDRAW]
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  // Object values of txType will be present. e.g. txType BET will have bet values

  constructor(transaction) {
    Object.assign(this, transaction);
  }
}
