/** This is a mock module of ../mutations.js,
 * so the test files link to this instead of connecting to backend
 * this mock module is a interface between stores and mockData module.
 * */
import mockData from './mockData';

export function createTopic(
  name,
  results,
  centralizedOracle,
  bettingStartTime,
  bettingEndTime,
  resultSettingStartTime,
  resultSettingEndTime,
  escrowAmount,
  senderAddress,
) {
  const newTransaction = {
    createdTime: '',
    status: 'PENDING',
    token: 'BOT',
    txid: '',
    type: 'APPROVECREATEEVENT',
    createdBlock: 0,
    gasLimit: '100000000',
    gasPrice: 0.01,
    senderAddress,
    version: 0,
    name,
    options: results,
    resultSetterAddress: centralizedOracle,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    amount: escrowAmount,
  };

  mockData.addTransactions(newTransaction);

  // return temp transaction
  return newTransaction;
}

export function createBetTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) {
  const newTransaction = {
    createdBlock: 0,
    createdTime: 0,
    gasLimit: '100000000',
    gasPrice: 0.01,
    senderAddress,
    version,
    topicAddress,
    oracleAddress,
    optionIdx,
    token: 'QTUM',
    amount,
    type: 'BET',
    status: 'PENDING',
  };

  mockData.addTransactions(newTransaction);

  // return temp transaction
  return newTransaction;
}

export function createSetResultTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) { // eslint-disable-line
}

export function createVoteTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) { // eslint-disable-line
}

export function createFinalizeResultTx(version, topicAddress, oracleAddress, senderAddress) { // eslint-disable-line
}

export function createWithdrawTx(type, version, topicAddress, senderAddress) { // eslint-disable-line
}

export function createTransferTx(senderAddress, receiverAddress, token, amount) { // eslint-disable-line
}
