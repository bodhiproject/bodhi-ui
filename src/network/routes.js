/* eslint-disable no-unused-vars */
const HOSTNAME_MAINNET = 'puti.io';
const HOSTNAME_TESTNET = 'dev.puti.io';
const HOSTNAME_REGTEST = 'test.puti.io';

const PORT_MAINNET = 8989;
const PORT_TESTNET = 6767;
const PORT_REGTEST = 5555;
/* eslint-enable no-unused-vars */

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : PORT_REGTEST;
const HOSTNAME = process.env.API_HOSTNAME ? process.env.API_HOSTNAME : HOSTNAME_REGTEST;
const HTTP_ROUTE = `${process.env.PROTOCOL_HTTP || 'https'}://${HOSTNAME}:${PORT}`;
const WS_ROUTE = `${process.env.PROTOCOL_WS || 'wss'}://${HOSTNAME}:${PORT}/graphql`;

const BASE_QTUM_WEB = `https://${HOSTNAME === HOSTNAME_MAINNET ? 'explorer' : 'testnet'}.qtum.org`;
const BASE_INSIGHT = `${BASE_QTUM_WEB}/insight-api`;

export default {
  graphql: {
    http: `${HTTP_ROUTE}/graphql`,
    subs: WS_ROUTE,
  },
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
    tx: 'https://qtumhost/tx',
  },
};
