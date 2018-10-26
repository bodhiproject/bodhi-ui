import { TransactionStatus } from 'constants';

import { satoshiToDecimal, decimalToSatoshi } from '../../helpers/utility';

/**
 * Model for Transactions.
 */
export default class Vote {
  type = '' // One of: DBVoteType
  txid = '' // Transaction ID assigned by the blockchain
  status = '' // only success
  block
  blockNum = 0 // Block number when Transaction was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  voterAddress = '' // Sender's address
  topicAddress = '' // Topic contract address associated with Transaction
  oracleAddress = '' // Oracle contract address associated with Transaction
  optionIdx = 0 // Result index used for Transaction. eg. For a bet, this would be the result index the user bet on.
  amount = '' // Token amount in decimals
  amountSatoshi = '' // Token amount in satoshi
  token = '' // Token type used for Transaction. QTUM for BET. BOT for VOTE.
  version = 0 // Current version of the contract. To manage deprecations later.
  localizedInvalid = {}; // for invalid option
  topic

  constructor(vote) {
    Object.assign(this, vote);
    this.status = TransactionStatus.SUCCESS;
    this.amount = satoshiToDecimal(this.amount).toString();
    this.amountSatoshi = decimalToSatoshi(this.amount);
    this.blockTime = this.block.blockTime;
    this.blockNum = this.block.blockNum;
    this.localizedInvalid = {
      en: 'Invalid',
      zh: '无效',
      ko: '무효의',
      parse(locale) {
        return this[locale.slice(0, 2)];
      },
    };
  }
}
