import { isProduction } from '../config/app';

const PORT = 8989;
const AUTHORITY = `${isProduction() ? 'puti.io' : 'localhost'}:${PORT}`;
const HTTP_ROUTE = `${isProduction() ? 'https' : 'http'}://${AUTHORITY}`;
const WS_ROUTE = `${isProduction() ? 'wss' : 'ws'}://${AUTHORITY}/graphql`;

const BASE_QTUM_WEB = `https://${isProduction() ? 'explorer' : 'testnet'}.qtum.org`;
const BASE_INSIGHT = `${BASE_QTUM_WEB}/insight-api`;

export default {
  graphql: {
    http: `${HTTP_ROUTE}/graphql`,
    subs: WS_ROUTE,
  },
  api: {
    getWalletInfo: `${HTTP_ROUTE}/get-wallet-info`,
    unlockWallet: `${HTTP_ROUTE}/wallet-passphrase`,
    eventEscrowAmount: `${HTTP_ROUTE}/event-escrow-amount`,
    winnings: `${HTTP_ROUTE}/winnings`,
    betBalances: `${HTTP_ROUTE}/bet-balances`,
    voteBalances: `${HTTP_ROUTE}/vote-balances`,
    validateAddress: `${HTTP_ROUTE}/validate-address`,
    encryptWallet: `${HTTP_ROUTE}/encrypt-wallet`,
    backupWallet: `${HTTP_ROUTE}/backup-wallet`,
    importWallet: `${HTTP_ROUTE}/import-wallet`,
    transactionCost: `${HTTP_ROUTE}/transaction-cost`,
    walletPassphraseChange: `${HTTP_ROUTE}/wallet-passphrase-change`,
  },
  insight: {
    totals: `${BASE_INSIGHT}/statistics/total`,
  },
  explorer: {
    tx: 'https://qtumhost/tx',
  },
};
