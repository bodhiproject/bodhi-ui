const SSL = process.env.SSL === 'true';
const HOSTNAME = process.env.API_HOSTNAME;
const HTTP_ROUTE = `${SSL ? 'https' : 'http'}://${HOSTNAME}`;
const WS_ROUTE = `${SSL ? 'wss' : 'ws'}://${HOSTNAME}/graphql`;
const EXPLORER_URL = process.env.NETWORK === 'mainnet'
  ? 'https://explorer.nakachain.org'
  : 'https://testnet.explorer.nakachain.org';

export const GRAPHQL = {
  HTTP: `${HTTP_ROUTE}/graphql`,
  SUBS: WS_ROUTE,
};

export const API = {
  LOG_CLIENT_ERROR: `${HTTP_ROUTE}/log/client-error`,
  EVENT_FACTORY_ADDRESS: `${HTTP_ROUTE}/config-manager/event-factory-address`,
  EVENT_ESCROW_AMOUNT: `${HTTP_ROUTE}/config-manager/event-escrow-amount`,
  ARBITRATION_LENGTH: `${HTTP_ROUTE}/config-manager/arbitration-length`,
  STARTING_CONSENSUS_THRESHOLD: `${HTTP_ROUTE}/config-manager/starting-consensus-threshold`,
  THRESHOLD_PERCENT_INCREASE: `${HTTP_ROUTE}/config-manager/threshold-percent-increase`,
  CALCULATE_WINNINGS: `${HTTP_ROUTE}/multiple-results-event/calculate-winnings`,
  VERSION: `${HTTP_ROUTE}/multiple-results-event/version`,
  ROUND: `${HTTP_ROUTE}/multiple-results-event/round`,
  RESULT_INDEX: `${HTTP_ROUTE}/multiple-results-event/result-index`,
  CONSENSUS_THRESHOLD: `${HTTP_ROUTE}/multiple-results-event/consensus-threshold`,
  ARBITRATION_END_TIME: `${HTTP_ROUTE}/multiple-results-event/arbitration-end-time`,
  EVENT_METADATA: `${HTTP_ROUTE}/multiple-results-event/event-metadata`,
  CENTRALIZED_METADATA: `${HTTP_ROUTE}/multiple-results-event/centralized-metadata`,
  CONFIG_METADATA: `${HTTP_ROUTE}/multiple-results-event/config-metadata`,
  TOTAL_BETS: `${HTTP_ROUTE}/multiple-results-event/total-bets`,
  DID_WITHDRAW: `${HTTP_ROUTE}/multiple-results-event/did-withdraw`,
  DID_WITHDRAW_ESCROW: `${HTTP_ROUTE}/multiple-results-event/did-withdraw-escrow`,
};

export const EXPLORER = {
  TX: `${EXPLORER_URL}/tx`,
};
