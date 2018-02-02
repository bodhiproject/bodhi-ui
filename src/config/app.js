const BASE_URL = 'http://localhost:5555';
const BASE_INSIGHT_DEV = 'https://testnet.qtum.org/insight-api';
const BASE_INSIGHT_PROD = 'https://explorer.qtum.org/insight-api';

module.exports = {
  endpoint: {
    bodhiapi: BASE_URL,
    graphql: `${BASE_URL}/graphql`,
    insight: BASE_INSIGHT_DEV,
  },
  intervals: {
    topBar: 10000, // MS interval for topbar polling
  },
};
