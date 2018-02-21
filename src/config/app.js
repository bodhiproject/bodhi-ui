const AUTHORITY = '127.0.0.1:5555';
const HTTP_ROUTE = `http://${AUTHORITY}`;
const WS_ROUTE = `ws://${AUTHORITY}`;
const BASE_INSIGHT_DEV = 'https://testnet.qtum.org/insight-api';
const BASE_INSIGHT_PROD = 'https://explorer.qtum.org/insight-api';

module.exports = {
  endpoint: {
    api: HTTP_ROUTE,
    graphHttp: `${HTTP_ROUTE}/graphql`,
    graphSubs: `${WS_ROUTE}/subscriptions`,
    insight: BASE_INSIGHT_DEV,
  },
  intervals: { // in MS
    syncInfo: 20000,
  },
  defaults: {
    averageBlockTime: 142.01324503311258,
    version: 0, // TODO: remove and fetch from API or have GraphQL return this
  },
};
