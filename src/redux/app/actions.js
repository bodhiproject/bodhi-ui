import { subscribe, unsubscribe } from 'redux-graphql-subscriptions';

import subscriptions, { channels } from '../../network/graphSubscription';

export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

const actions = {
  TOGGLE_ALL: 'TOGGLE_ALL',
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },

  ADD_WALLET_ADDRESS: 'ADD_WALLET_ADDRESS',
  SELECT_WALLET_ADDRESS: 'SELECT_WALLET_ADDRESS',
  addWalletAddress: (value) => ({
    type: actions.ADD_WALLET_ADDRESS,
    value,
  }),
  selectWalletAddress: (value) => ({
    type: actions.SELECT_WALLET_ADDRESS,
    value,
  }),

  SUBSCRIBE_SYNC_INFO_RETURN: 'SUBSCRIBE_SYNC_INFO_RETURN',
  subscribeSyncInfo: () => subscribe({
    query: subscriptions.ON_SYNC_INFO,
    variables: {
      channel: channels.ON_SYNC_INFO,
    },
    success: (result) => ({
      type: actions.SUBSCRIBE_SYNC_INFO_RETURN,
      value: { result },
    }),
    error: (error) => ({
      type: actions.SUBSCRIBE_SYNC_INFO_RETURN,
      value: error.message,
    }),
  }),

  LIST_UNSPENT: 'LIST_UNSPENT',
  LIST_UNSPENT_RESULT: 'LIST_UNSPENT_RESULT',
  listUnspent: () => ({
    type: actions.LIST_UNSPENT,
  }),

  GET_BOT_BALANCE: 'GET_BOT_BALANCE',
  GET_BOT_BALANCE_RETURN: 'GET_BOT_BALANCE_RETURN',
  getBotBalance: (owner, senderAddress) => ({
    type: actions.GET_BOT_BALANCE,
    payload: {
      owner,
      senderAddress,
    },
  }),

  GET_SYNC_INFO: 'GET_SYNC_INFO',
  GET_SYNC_INFO_RETURN: 'GET_SYNC_INFO_RETURN',
  getSyncInfo: () => ({
    type: actions.GET_SYNC_INFO,
  }),

  UPDATE_SYNC_PROGRESS: 'UPDATE_SYNC_PROGRESS',
  updateSyncProgress: (percentage) => ({
    type: actions.UPDATE_SYNC_PROGRESS,
    percentage,
  }),

  TOGGLE_SYNCING: 'TOGGLE_SYNCING',
  toggleSyncing: (isSyncing) => ({
    type: actions.TOGGLE_SYNCING,
    isSyncing,
  }),

  GET_INSIGHT_TOTALS: 'GET_INSIGHT_TOTALS',
  GET_INSIGHT_TOTALS_RETURN: 'GET_INSIGHT_TOTALS_RETURN',
  getInsightTotals: () => ({
    type: actions.GET_INSIGHT_TOTALS,
  }),
};
export default actions;
