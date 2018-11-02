import { TransactionType } from 'constants';
import { satoshiToDecimal } from '../../helpers/utility';

/**
 * Model for Votes.
 */
export default class Vote {
  type = '' // One of: bet, result set, vote
  txid = '' // Vote ID assigned by the blockchain
  blockNum = 0 // Block number when Vote was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  senderAddress = '' // Sender's address
  topicAddress = '' // Topic contract address associated with Vote
  oracleAddress = '' // Oracle contract address associated with Vote
  optionIdx = null // Result index used for Vote. eg. For a bet, this would be the result index the user bet on.
  amount = '' // Token amount in decimals
  amountSatoshi = '' // Token amount in satoshi
  token = '' // Token type used for Vote. QTUM for BET. BOT for VOTE.
  version = 0 // Current version of the contract. To manage deprecations later.

  constructor(vote) {
    Object.assign(this, vote);
    this.amountSatoshi = this.amount;
    this.amount = satoshiToDecimal(this.amount).toString();
    this.blockTime = vote.block.blockTime;
    this.blockNum = vote.block.blockNum;
    this.senderAddress = vote.voterAddress;
    if (this.type === 'RESULT_SET') this.type = TransactionType.SET_RESULT;
  }
}
