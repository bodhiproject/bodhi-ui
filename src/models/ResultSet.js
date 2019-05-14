import { satoshiToDecimal } from '../../helpers/utility';

export default class ResultSet {
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  eventAddress // Event contract address
  centralizedOracleAddress // Result setters address (only for eventRound 0)
  resultIndex // Result index the bet was placed on
  amount // Bet amount in decimals
  amountSatoshi // Bet amount in satoshi
  eventRound // Round of the event for the bet

  constructor(resultSet) {
    Object.assign(this, resultSet);
    this.amount = satoshiToDecimal(resultSet.amount);
    this.amountSatoshi = resultSet.amount;
  }
}
