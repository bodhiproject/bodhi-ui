import Contracts from '../../config/contracts';

// const restify = require('restify');
// const corsMiddleware = require('restify-cors-middleware');
const Qweb3 = require('../../modules/qweb3.js').default;
const Qweb3Instance = new Qweb3('http://bodhi:bodhi@localhost:13889');

// const server = restify.createServer();
// const cors = corsMiddleware({
//   origins: ['*'],
// });
// server.pre(cors.preflight);
// server.use(cors.actual);
// server.post('/isconnected', (req, res, next) => {
//   Qweb3.isConnected()
//     .then((result) => {
//       res.send(200, {
//         isConnected: result,
//       });
//       next();
//     });
// });

async function listUnspent() {
  console.log('Listing unspent outputs:');
  const result = await Qweb3Instance.listUnspent();
  console.log(result);
}

// CentralizedOracle functions
async function bet(centralizedOracleAddress, resultIndex, senderAddress) {
  console.log('bet() '.concat(centralizedOracleAddress));

  const oracle = new Qweb3Instance.Contract(centralizedOracleAddress, Contracts.CentralizedOracle.abi);
  const tx = await oracle.send('bet', {
    methodArgs: [resultIndex],
    amount: 1,
    senderAddress: senderAddress,
  });
  console.log(tx);
}

async function setResult(centralizedOracleAddress, resultIndex, senderAddress) {
  console.log('setResult() '.concat(centralizedOracleAddress));

  const oracle = new Qweb3Instance.Contract(centralizedOracleAddress, Contracts.CentralizedOracle.abi);
  const tx = await oracle.send('setResult', {
    methodArgs: [resultIndex],
    gasLimit: 3000000,
    senderAddress: senderAddress,
  });
  console.log(tx);
}

async function getBetBalances(centralizedOracleAddress, senderAddress) {
  console.log('getBetBalances() '.concat(centralizedOracleAddress));

  const oracle = new Qweb3Instance.Contract(centralizedOracleAddress, Contracts.CentralizedOracle.abi);
  const result = await oracle.send('getBetBalances', {
    methodArgs: [],
    senderAddress: senderAddress,
  });
  console.log(result);
}

module.exports = {
  listUnspent: listUnspent,
  bet: bet,
  setResult: setResult,
  getBetBalances: getBetBalances,
};
