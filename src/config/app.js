module.exports = {
  intervals: { // in MS
    syncInfo: 10000,
    tooltipDelay: 300,
    snackbarLong: 5000,
    snackbarShort: 2000,
  },
  defaults: {
    averageBlockTime: 142.01324503311258,
    unlockWalletMins: 5,
  },
  maxTransactionFee: 0.1,
  faqUrls: {
    'en-US': 'https://www.bodhi.network/faq',
    'zh-Hans-CN': 'https://cn.bodhi.network/faq',
  },
  debug: {
    // Set to false if in test environment and Insight API is down
    // and loading screen is blocking the view.
    showAppLoad: true,
  },
  analytics: {
    mixpanelToken: '5c13e6b02fc222c0adae2f1f8cd923b0',
  },
};
