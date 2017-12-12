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

export async function listUnspent() {
  console.log('Listing unspent outputs:');
  const result = await Qweb3Instance.listUnspent();
  console.log(result);
}

export async function bet(centralizedOracleAddress, resultIndex, senderAddress) {
  console.log('Placing bet @ '.concat(centralizedOracleAddress));

  const centralizedOracle = new Qweb3Instance.Contract(centralizedOracleAddress, Contracts.CentralizedOracle.abi);
  const hardcodedAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';
  const result = await centralizedOracle.send('bet', {
    data: [resultIndex],
    amount: 1,
    senderAddress: hardcodedAddress,
  });
  console.log(result);
}
