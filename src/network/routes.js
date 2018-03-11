import { endpoint } from '../config/app';

const BODHI_API = endpoint.api;
const INSIGHT_API = endpoint.insight;

const Routes = {
  unlockWallet: `${BODHI_API}/wallet-passphrase`,
  getWalletInfo: `${BODHI_API}/get-wallet-info`,
  listUnspent: `${BODHI_API}/list-unspent`,
  getAccountAddress: `${BODHI_API}/get-account-address`,
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
  betBalances: `${BODHI_API}/bet-balances`,
  voteBalances: `${BODHI_API}/vote-balances`,
  insightTotals: `${INSIGHT_API}/statistics/total`,
};

export default Routes;
