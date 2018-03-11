export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

const appActions = {
  TOGGLE_ALL: 'TOGGLE_ALL',
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: appActions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },

  SET_LAST_USED_ADDRESS: 'SET_LAST_USED_ADDRESS',
  setLastUsedAddress: (address) => ({
    type: appActions.SET_LAST_USED_ADDRESS,
    address,
  }),

  GET_SYNC_INFO: 'GET_SYNC_INFO',
  getSyncInfo: () => ({
    type: appActions.GET_SYNC_INFO,
  }),
  ON_SYNC_INFO: 'ON_SYNC_INFO',
  onSyncInfo: (syncInfo) => ({
    type: appActions.ON_SYNC_INFO,
    syncInfo,
  }),
  SYNC_INFO_RETURN: 'SYNC_INFO_RETURN',

  GET_INSIGHT_TOTALS: 'GET_INSIGHT_TOTALS',
  GET_INSIGHT_TOTALS_RETURN: 'GET_INSIGHT_TOTALS_RETURN',
  getInsightTotals: () => ({
    type: appActions.GET_INSIGHT_TOTALS,
  }),

  TOGGLE_WALLET_UNLOCK_DIALOG: 'TOGGLE_WALLET_UNLOCK_DIALOG',
  toggleWalletUnlockDialog: (isVisible) => ({
    type: appActions.TOGGLE_WALLET_UNLOCK_DIALOG,
    isVisible,
  }),

  UNLOCK_WALLET: 'UNLOCK_WALLET',
  UNLOCK_WALLET_RETURN: 'UNLOCK_WALLET_RETURN',
  unlockWallet: (passphrase, timeout) => ({
    type: appActions.UNLOCK_WALLET,
    passphrase,
    timeout,
  }),
};
export default appActions;
