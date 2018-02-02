const BASE_URL = 'http://localhost:5555';
const BASE_INSIGHT_DEV = 'https://testnet.qtum.org';
const BASE_INSIGHT_PROD = 'https://explorer.qtum.org';

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
