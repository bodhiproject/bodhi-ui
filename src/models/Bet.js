import { satoshiToDecimal } from '../helpers/utility';

export default class Bet {
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  eventAddress // Event contract address
  betterAddress // Better's address
  betterName // Better's name
  txSender // Transaction sender address, same as above
  resultIndex // Result index the bet was placed on
  amount // Bet amount in decimals
  amountSatoshi // Bet amount in satoshi
  eventRound // Round of the event for the bet

  constructor(bet) {
    Object.assign(this, bet);
    this.amount = satoshiToDecimal(bet.amount);
    this.amountSatoshi = bet.amount;
    this.txSender = bet.betterAddress;
  }
}
