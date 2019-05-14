const SSL = Boolean(process.env.SSL);
const HOSTNAME = process.env.API_HOSTNAME;
const HTTP_ROUTE = `${SSL ? 'https' : 'http'}://${HOSTNAME}`;
const WS_ROUTE = `${SSL ? 'wss' : 'ws'}://${HOSTNAME}/graphql`;

export const GRAPHQL = {
  HTTP: `${HTTP_ROUTE}/graphql`,
  SUBS: WS_ROUTE,
};

export const API = {
  eventFactoryAddress: `${HTTP_ROUTE}/config-manager/event-factory-address`,
  eventEscrowAmount: `${HTTP_ROUTE}/config-manager/event-escrow-amount`,
  arbitrationLength: `${HTTP_ROUTE}/config-manager/arbitration-length`,
  arbitrationRewardPercentage: `${HTTP_ROUTE}/config-manager/arbitration-reward-percentage`,
  startingOracleThreshold: `${HTTP_ROUTE}/config-manager/starting-oracle-threshold`,
  thresholdPercentIncrease: `${HTTP_ROUTE}/config-manager/threshold-percent-increase`,
  calculateWinnings: `${HTTP_ROUTE}/multiple-results-event/calculate-winnings`,
  version: `${HTTP_ROUTE}/multiple-results-event/version`,
  round: `${HTTP_ROUTE}/multiple-results-event/round`,
  resultIndex: `${HTTP_ROUTE}/multiple-results-event/result-index`,
  consensusThreshold: `${HTTP_ROUTE}/multiple-results-event/consensus-threshold`,
  arbitrationEndTime: `${HTTP_ROUTE}/multiple-results-event/arbitration-end-time`,
  eventMetadata: `${HTTP_ROUTE}/multiple-results-event/event-metadata`,
  centralizedMetadata: `${HTTP_ROUTE}/multiple-results-event/centralized-metadata`,
  configMetadata: `${HTTP_ROUTE}/multiple-results-event/config-metadata`,
  totalBets: `${HTTP_ROUTE}/multiple-results-event/total-bets`,
  didWithdraw: `${HTTP_ROUTE}/multiple-results-event/did-withdraw`,
  didWithdrawEscrow: `${HTTP_ROUTE}/multiple-results-event/did-withdraw-escrow`,
};

export default {
  insight: {
    totals: `${BASE_INSIGHT}/statistics/total`,
  },
  explorer: {
    tx: process.env.LOCAL_WALLET === 'true' ? 'https://qtumhost/tx' : `${BASE_QTUM_WEB}/tx`,
  },
};
