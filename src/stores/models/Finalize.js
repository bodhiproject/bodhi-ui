/**
 * Model for Finalize.
 */
export default class Finalize {
  type = ''
  txid = '' // Finalize ID assigned by the blockchain
  blockNum = 0 // Block number when Finalize was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  fromAddress = '' // Sender's address
  topicAddress = '' // Topic contract address associated with Finalize
  optionIdx = null // Result index used for Finalize. eg. For a bet, this would be the result index the user bet on.
  version = 0 // Current version of the contract. To manage deprecations later.

  constructor(finalize) {
    Object.assign(this, finalize);
    this.blockTime = finalize.block.blockTime;
    this.blockNum = finalize.block.blockNum;
    this.type = 'FINALIZERESULT';
    this.optionIdx = finalize.resultIdx;
  }
}
