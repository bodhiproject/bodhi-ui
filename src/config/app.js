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
    tooltipDelay: 300,
  },
  defaults: {
    averageBlockTime: 142.01324503311258,
  },
  debug: {
    // Set to false if in test environment and Insight API is down
    // and loading screen is blocking the view.
    showAppLoad: true,
  },
};
