import { satoshiToDecimal } from '../helpers/utility';

export default class ResultSet {
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  eventAddress // Event contract address
  centralizedOracleAddress // Result setters address (only for eventRound 0)
  resultIndex // Result index that was set
  amount // Result set amount in decimals
  amountSatoshi // Result set amount in satoshi
  eventRound // Round of the event for the result set. 0 is set by Centralized Oracle. > 0 is set by arbitration.

  constructor(resultSet) {
    Object.assign(this, resultSet);
    console.log('TCL: ResultSet -> constructor -> resultSet', resultSet);
    this.amount = satoshiToDecimal(resultSet.amount);
    this.amountSatoshi = resultSet.amount;
  }
}
