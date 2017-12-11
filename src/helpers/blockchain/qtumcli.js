import Contracts from '../../../config/contracts';

const Qweb3 = require('../../modules/qweb3.js').default;
const Qweb3Instance = new Qweb3('http://bodhi:bodhi@localhost:13889');

export async function listUnspent() {
  console.log('Listing unspent outputs:');
  const result = await Qweb3.listUnspent();
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
