import Contracts from '../../config/contracts';

import Qweb3 from '../../modules/qweb3';
const Qweb3Instance = new Qweb3('http://bodhi:bodhi@localhost:13889');

// Blockchain functions
export async function listUnspent() {
  console.log('listUnspent');
  const result = await Qweb3Instance.listUnspent();
  console.log(result);
}

export async function getBlockCount() {
  console.log('getBlockCount');
  const result = await Qweb3Instance.getBlockCount();
  console.log(result);
}

// CentralizedOracle functions
export async function bet(centralizedOracleAddress, resultIndex, senderAddress) {
  console.log('bet() '.concat(centralizedOracleAddress));
  const tx = await getCentralizedOracle(centralizedOracleAddress).send('bet', {
    methodArgs: [resultIndex],
    amount: 1,
    senderAddress,
  });
  console.log(tx);
}

export async function setResult(centralizedOracleAddress, resultIndex, senderAddress) {
  console.log('setResult() '.concat(centralizedOracleAddress));
  const tx = await getCentralizedOracle(centralizedOracleAddress).send('setResult', {
    methodArgs: [resultIndex],
    gasLimit: 3000000,
    senderAddress,
  });
  console.log(tx);
}

export async function getBetBalances(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'getBetBalances', [], senderAddress);
}

export async function getVoteBalances(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'getVoteBalances', [], senderAddress);
}

export async function getTotalBets(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'getTotalBets', [], senderAddress);
}

export async function getTotalVotes(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'getTotalVotes', [], senderAddress);
}

export async function getResult(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'getResult', [], senderAddress);
}

export async function finished(centralizedOracleAddress, senderAddress) {
  this.callCentralizedOracle(centralizedOracleAddress, 'finished', [], senderAddress);
}

async function callCentralizedOracle(centralizedOracleAddress, methodName, methodArgs, senderAddress) {
  console.log(methodName.concat(' ').concat(centralizedOracleAddress));

  try {
    const result = await getCentralizedOracle(centralizedOracleAddress).call(methodName, {
      methodArgs,
      senderAddress,
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

function getCentralizedOracle(centralizedOracleAddress) {
  return new Qweb3Instance.Contract(centralizedOracleAddress, Contracts.CentralizedOracle.abi);
}
