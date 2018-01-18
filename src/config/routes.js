import { endpoint } from './app';

const { bodhiapi } = endpoint;

const Routes = {
  listUnspent: `${bodhiapi}/list-unspent`,
  getAccountAddress: `${bodhiapi}/get-account-address`,
  getBlockCount: `${bodhiapi}/get-block-count`,
  approve: `${bodhiapi}/approve`,
  allowance: `${bodhiapi}/allowance`,
  botBalance: `${bodhiapi}/bot-balance`,
  createTopic: `${bodhiapi}/createtopic`,
  bet: `${bodhiapi}/bet`,
  setResult: `${bodhiapi}/set-result`,
  vote: `${bodhiapi}/vote`,
  finalizeResult: `${bodhiapi}/finalize-result`,
  withdraw: `${bodhiapi}/withdraw`,
  winnings: `${bodhiapi}/winnings`,
};

export default Routes;
