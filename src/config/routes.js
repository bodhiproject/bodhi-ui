import { endpoint } from './app';

const { bodhiapi } = endpoint;

const Routes = {
  listUnspent: `${bodhiapi}/list-unspent`,
  getAccountAddress: `${bodhiapi}/get-account-address`,
  getBlockCount: `${bodhiapi}/get-block-count`,
  botBalance: `${bodhiapi}/bot-balance`,
};

export default Routes;
