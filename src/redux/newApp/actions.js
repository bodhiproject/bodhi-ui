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

  ADD_WALLET_ADDRESS: 'ADD_WALLET_ADDRESS',
  SELECT_WALLET_ADDRESS: 'SELECT_WALLET_ADDRESS',
  addWalletAddress: (value) => ({
    type: appActions.ADD_WALLET_ADDRESS,
    value,
  }),
  selectWalletAddress: (value) => ({
    type: appActions.SELECT_WALLET_ADDRESS,
    value,
  }),

  LIST_UNSPENT: 'LIST_UNSPENT',
  LIST_UNSPENT_RETURN: 'LIST_UNSPENT_RETURN',
  listUnspent: () => ({
    type: appActions.LIST_UNSPENT,
  }),

  GET_BOT_BALANCE: 'GET_BOT_BALANCE',
  GET_BOT_BALANCE_RETURN: 'GET_BOT_BALANCE_RETURN',
  getBotBalance: (owner, senderAddress) => ({
    type: appActions.GET_BOT_BALANCE,
    payload: {
      owner,
      senderAddress,
    },
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

  UPDATE_SYNC_PROGRESS: 'UPDATE_SYNC_PROGRESS',
  updateSyncProgress: (percentage) => ({
    type: appActions.UPDATE_SYNC_PROGRESS,
    percentage,
  }),

  TOGGLE_INITIAL_SYNC: 'TOGGLE_INITIAL_SYNC',
  toggleInitialSync: (isSyncing) => ({
    type: appActions.TOGGLE_INITIAL_SYNC,
    isSyncing,
  }),

  GET_INSIGHT_TOTALS: 'GET_INSIGHT_TOTALS',
  GET_INSIGHT_TOTALS_RETURN: 'GET_INSIGHT_TOTALS_RETURN',
  getInsightTotals: () => ({
    type: appActions.GET_INSIGHT_TOTALS,
  }),
};
export default appActions;
