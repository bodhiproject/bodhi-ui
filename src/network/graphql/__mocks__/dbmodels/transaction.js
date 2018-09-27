import { TransactionStatus } from 'constants';

/*
* DbModel for Transaction mocks.
*/
export default class Transaction {
  txid = '' // Transaction ID assigned by the blockchain
  blockNum = 0 // Block number when Transaction was recorded on blockchain
  blockTime = '' // Block timestamp for blockNum
  createdBlock = 0
  createdTime = '' // UNIX timestamp when Transaction was created
  gasLimit = '' // Gas limit set (string)
  gasPrice = ''// Gas price set (string)
  gasUsed = 0 // Actual gas used (gas number?)
  type = '' // One of: TransactionType
  status = '' // One of: [PENDING, SUCCESS, FAIL]
  senderAddress = '' // Sender's address
  receiverAddress = '' // Receiver's address. Only used for TRANSFER types.
  topicAddress = '' // Topic contract address associated with Transaction
  oracleAddress = '' // Oracle contract address associated with Transaction
  name = '' // Name of the event
  options = []
  resultSetterAddress = ''
  bettingStartTime = ''
  bettingEndTime = ''
  resultSettingStartTime = ''
  resultSettingEndTime = ''
  optionIdx = 0 // Result index used for Transaction. eg. For a bet, this would be the result index the user bet on.
  token = '' // Token type used for Transaction. QTUM for BET. BOT for VOTE.
  amount = '' // Amount of token used (satoshi?)
  topic // The Topic object associated with the Transaction
  version = 0 // Current version of the contract. To manage deprecations later.

  triggerListOnSuccess = []
  triggerListOnFailed = []
  triggetListOnCreate = []

  setSuccess = () => {
    this.status = TransactionStatus.SUCCESS;
    this.triggerListOnSuccess.map((x) => x(this));
  };

  setFail = () => {
    this.status = TransactionStatus.FAIL;
    this.triggerListOnFail.map((x) => x(this));
  };

  constructor(txid, transaction) {
    Object.assign(this, transaction);
    if (txid) this.txid = txid;
    this.status = TransactionStatus.PENDING;
    this.triggerListOnCreate.map((x) => x(this));
  }
}
