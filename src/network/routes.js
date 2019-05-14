const SSL = Boolean(process.env.SSL);
const HOSTNAME = process.env.API_HOSTNAME;
const HTTP_ROUTE = `${SSL ? 'https' : 'http'}://${HOSTNAME}`;
const WS_ROUTE = `${SSL ? 'wss' : 'ws'}://${HOSTNAME}/graphql`;

export const GRAPHQL = {
  HTTP: `${HTTP_ROUTE}/graphql`,
  SUBS: WS_ROUTE,
};

export default {
  api: {
    allowance: `${HTTP_ROUTE}/allowance`,
    botBalance: `${HTTP_ROUTE}/bot-balance`,
    eventEscrowAmount: `${HTTP_ROUTE}/event-escrow-amount`,
    winnings: `${HTTP_ROUTE}/winnings`,
    betBalances: `${HTTP_ROUTE}/bet-balances`,
    voteBalances: `${HTTP_ROUTE}/vote-balances`,
    transactionCost: `${HTTP_ROUTE}/transaction-cost`,
    validateAddress: `${HTTP_ROUTE}/validate-address`,
    getWalletInfo: `${HTTP_ROUTE}/get-wallet-info`,
    unlockWallet: `${HTTP_ROUTE}/wallet-passphrase`,
    encryptWallet: `${HTTP_ROUTE}/encrypt-wallet`,
    backupWallet: `${HTTP_ROUTE}/backup-wallet`,
    importWallet: `${HTTP_ROUTE}/import-wallet`,
    walletPassphraseChange: `${HTTP_ROUTE}/wallet-passphrase-change`,
  },
  insight: {
    totals: `${BASE_INSIGHT}/statistics/total`,
  },
  explorer: {
    tx: process.env.LOCAL_WALLET === 'true' ? 'https://qtumhost/tx' : `${BASE_QTUM_WEB}/tx`,
  },
};
