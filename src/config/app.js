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
    NAKA_WALLET_CHROME: 'https://chrome.google.com/webstore/detail/naka-wallet/leopeeejkinfegnjkhpmpkaddnicjlll',
    NAKA_WALLET_APP_STORE: 'https://itunes.apple.com/us/app/naka-wallet/id1448562757',
    NAKA_WALLET_APP_STORE_CHINA: 'https://testflight.apple.com/join/MH8gFxwS',
    NAKA_WALLET_PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.nakachain.wallet',
    NAKA_WALLET_PLAY_STORE_CHINA: 'https://nakachain.org/app-release_1.7.1_31.apk',
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
    TUTORIAL_DISPLAYED: 'tutorialDisplayed',
    FAVORITES: 'favorites',
  },
};
