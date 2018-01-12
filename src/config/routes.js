import { endpoint } from '../../config/app';

const { bodhiapi } = endpoint;

module.exports = {
  Routes: {
    listUnspent: `${bodhiapi}/list-unspent`,
    getAccountAddress: `${bodhiapi}/get-account-address`,
    getBlockCount: `${bodhiapi}/get-block-count`,
    botBalance: `${bodhiapi}/bot-balance`,
  },
};
