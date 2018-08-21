import { isProduction } from '../config/app';

const AUTHORITY = 'puti.io:8989';
const HTTP_ROUTE = `https://${AUTHORITY}`;
const WS_ROUTE = `wss://${AUTHORITY}`;

const BASE_INSIGHT = `${QTUM_EXPLORER}/insight-api`;
const QTUM_EXPLORER = isProduction() ? 'https://explorer.qtum.org' : 'https://testnet.qtum.org';

export default {
  graphql: {
    http: `${HTTP_ROUTE}/graphql`,
    subs: `${WS_ROUTE}/ws`,
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
