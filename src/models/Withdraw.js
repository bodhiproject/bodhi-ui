import { satoshiToDecimal } from '../../helpers/utility';

export default class Withdraw {
  txid // Transaction ID returned when confirmed
  txStatus // One of: [PENDING, SUCCESS, FAIL]
  txReceipt // Transaction receipt returned when confirmed
  blockNum // Block number when executed
  block // Block info returned when confirmed
  eventAddress // Event contract address
  winnerAddress // Winner address
  winningAmount // Won amount in decimals
  winningAmountSatoshi // Won amount in satoshi
  escrowAmount // Escrow amount withdrawn in decimals
  escrowAmountSatoshi // Escrow amount withdrawn in satoshi

  constructor(withdraw) {
    Object.assign(this, withdraw);
    this.winningAmount = satoshiToDecimal(withdraw.winningAmount);
    this.winningAmountSatoshi = withdraw.winningAmount;
    this.escrowAmount = satoshiToDecimal(withdraw.escrowAmount);
    this.escrowAmountSatoshi = withdraw.escrowAmount;
  }
}
