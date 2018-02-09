import { endpoint } from './app';

const BODHI_API = endpoint.bodhiapi;
const INSIGHT_API = endpoint.insight;

const Routes = {
  listUnspent: `${BODHI_API}/list-unspent`,
  getAccountAddress: `${BODHI_API}/get-account-address`,
  getBlockchainInfo: `${BODHI_API}/get-blockchain-info`,
  approve: `${BODHI_API}/approve`,
  allowance: `${BODHI_API}/allowance`,
  botBalance: `${BODHI_API}/bot-balance`,
  createTopic: `${BODHI_API}/create-topic`,
  bet: `${BODHI_API}/bet`,
  setResult: `${BODHI_API}/set-result`,
  vote: `${BODHI_API}/vote`,
  finalizeResult: `${BODHI_API}/finalize-result`,
  withdraw: `${BODHI_API}/withdraw`,
  winnings: `${BODHI_API}/winnings`,
  insightTotals: `${INSIGHT_API}/statistics/total`,
};

export default Routes;
