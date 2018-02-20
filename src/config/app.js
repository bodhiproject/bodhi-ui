const HOSTNAME = '127.0.0.1';
const HTTP_ROUTE = `http://${HOSTNAME}:5555`;
const WS_ROUTE = `ws://${HOSTNAME}:5555`;
const BASE_INSIGHT_DEV = 'https://testnet.qtum.org/insight-api';
const BASE_INSIGHT_PROD = 'https://explorer.qtum.org/insight-api';

module.exports = {
  endpoint: {
    api: HTTP_ROUTE,
    graphHttp: `${HTTP_ROUTE}/graphql`,
    graphWs: WS_ROUTE,
    insight: BASE_INSIGHT_DEV,
  },
  intervals: { // in MS
    syncInfo: 10000,
    listUnspent: 10000,
  },
  defaults: {
    averageBlockTime: 142.01324503311258,
  },
};
