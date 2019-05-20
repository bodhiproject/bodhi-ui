module.exports = {
  isProduction: () => process.env.NODE_ENV === 'production',
  intervals: { // in MS
    syncInfo: 5000,
    tooltipDelay: 300,
    snackbarLong: 5000,
    snackbarShort: 2000,
  },
  defaults: {
    averageBlockTime: 142.01324503311258,
  },
  maxTransactionFee: 0.1,
  faqUrls: {
    'en-US': 'https://www.bodhi.network/faq',
    'zh-Hans-CN': 'https://cn.bodhi.network/faq',
  },
  urls: {
    NakaWalletWebStore: 'https://chrome.google.com/webstore/detail/NakaWallet/hdmjdgjbehedbnjmljikggbmmbnbmlnd',
  },
  debug: {
    // Set to false if in test environment and Insight API is down
    // and loading screen is blocking the view.
    showAppLoad: false,
  },
  CHAIN_ID: {
    MAINNET: '2019',
    TESTNET: '2018',
  },
  NETWORK: {
    MAINNET: 'MAINNET',
    TESTNET: 'TESTNET',
  },
  STORAGE_KEY: {
    LOCALE: 'locale',
    FAVORITES: 'favorites',
  },
};
