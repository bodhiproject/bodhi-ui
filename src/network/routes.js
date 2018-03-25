const AUTHORITY = '127.0.0.1:5555';
const HTTP_ROUTE = `http://${AUTHORITY}`;
const WS_ROUTE = `ws://${AUTHORITY}`;

const QTUM_EXPLORER_DEV = 'https://testnet.qtum.org';
const QTUM_EXPLORER_PROD = 'https://explorer.qtum.org';

const BASE_INSIGHT_DEV = `${QTUM_EXPLORER_DEV}/insight-api`;
const BASE_INSIGHT_PROD = `${QTUM_EXPLORER_PROD}/insight-api`;

export default {
  graphql: {
    http: `${HTTP_ROUTE}/graphql`,
    subs: `${WS_ROUTE}/subscriptions`,
  },
  api: {
    getWalletInfo: `${HTTP_ROUTE}/get-wallet-info`,
    unlockWallet: `${HTTP_ROUTE}/wallet-passphrase`,
    eventEscrowAmount: `${HTTP_ROUTE}/event-escrow-amount`,
    winnings: `${HTTP_ROUTE}/winnings`,
    betBalances: `${HTTP_ROUTE}/bet-balances`,
    voteBalances: `${HTTP_ROUTE}/vote-balances`,
  },
  insight: {
    totals: `${BASE_INSIGHT_DEV}/statistics/total`,
  },
  explorer: {
    tx: `${QTUM_EXPLORER_DEV}/tx`,
  },
};
