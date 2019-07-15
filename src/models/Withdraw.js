import { satoshiToDecimal } from '../helpers/utility';

export default class Withdraw {
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  eventAddress // Event contract address
  winnerAddress // Winner address
  winnerName // Winner name
  txSender // Transaction sender address
  winningAmount // Won amount in decimals
  winningAmountSatoshi // Won amount in satoshi
  escrowWithdrawAmount // Escrow amount withdrawn in decimals
  escrowWithdrawAmountSatoshi // Escrow amount withdrawn in satoshi

  constructor(withdraw) {
    Object.assign(this, withdraw);
    this.winningAmount = satoshiToDecimal(withdraw.winningAmount);
    this.winningAmountSatoshi = withdraw.winningAmount;
    this.escrowWithdrawAmount = satoshiToDecimal(withdraw.escrowWithdrawAmount);
    this.escrowWithdrawAmountSatoshi = withdraw.escrowWithdrawAmount;
    this.txSender = withdraw.winnerAddress;
  }
}
