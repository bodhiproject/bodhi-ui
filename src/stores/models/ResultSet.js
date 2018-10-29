import { TransactionType } from 'constants';
/**
 * Model for ResultSet.
 */
export default class ResultSet {
  type = ''
  txid = '' // ResultSet ID assigned by the blockchain
  blockNum = 0 // Block number when ResultSet was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  fromAddress = '' // Sender's address
  topicAddress = '' // Topic contract address associated with ResultSet
  oracleAddress = ''
  optionIdx = null // Result index used for ResultSet. eg. For a bet, this would be the result index the user bet on.
  version = 0 // Current version of the contract. To manage deprecations later.

  constructor(resultset) {
    Object.assign(this, resultset);
    this.blockTime = resultset.block.blockTime;
    this.blockNum = resultset.block.blockNum;
    if (this.oracleAddress === null) this.type = TransactionType.FINALIZE_RESULT;
    else this.type = TransactionType.SET_RESULT;
    this.optionIdx = resultset.resultIdx;
  }
}
