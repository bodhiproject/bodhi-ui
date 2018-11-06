import { Token } from 'constants';

import { gasToQtum, satoshiToDecimal, decimalToSatoshi } from '../../helpers/utility';

/**
 * Model for Transactions.
 */
export default class Transaction {
  type = '' // One of: TransactionType
  txid = '' // Transaction ID assigned by the blockchain
  status = '' // One of: TransactionStatus
  createdTime = '' // UNIX timestamp when Transaction was created
  blockNum = 0 // Block number when Transaction was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  gasLimit = 0 // Gas limit set
  gasPrice = 0 // Gas price set
  gasUsed = 0 // Actual gas used
  senderAddress = '' // Sender's address
  receiverAddress = '' // Receiver's address. Only used for TRANSFER types.
  topicAddress = '' // Topic contract address associated with Transaction
  oracleAddress = '' // Oracle contract address associated with Transaction
  name = '' // Name of the event
  optionIdx = 0 // Result index used for Transaction. eg. For a bet, this would be the result index the user bet on.
  amount = '' // Token amount in decimals
  amountSatoshi = '' // Token amount in satoshi
  token = '' // Token type used for Transaction. QTUM for BET. BOT for VOTE.
  topic // The Topic object associated with the Transaction
  version = 0 // Current version of the contract. To manage deprecations later.
  localizedInvalid = {}; // for invalid option
  language = ''; // current transaction language

  constructor(transaction) {
    Object.assign(this, transaction);
    this.gasLimit = Number(this.gasLimit);
    this.gasPrice = Number(this.gasPrice);
    this.fee = gasToQtum(this.gasUsed);
    this.amount = this.token === Token.BOT ? satoshiToDecimal(this.amount).toString() : this.amount;
    this.amountSatoshi = decimalToSatoshi(this.amount);
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
