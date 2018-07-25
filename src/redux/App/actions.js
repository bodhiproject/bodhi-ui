
const appActions = {
  SET_LAST_USED_ADDRESS: 'SET_LAST_USED_ADDRESS',
  setLastUsedAddress: (address) => ({
    type: appActions.SET_LAST_USED_ADDRESS,
    address,
  }),

  GET_SYNC_INFO: 'GET_SYNC_INFO',
  getSyncInfo: (syncPercent) => ({
    type: appActions.GET_SYNC_INFO,
    syncPercent,
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

  VALIDATE_ADDRESS: 'VALIDATE_ADDRESS',
  VALIDATE_ADDRESS_RETURN: 'VALIDATE_ADDRESS_RETURN',
  validateAddress: (address) => ({
    type: appActions.VALIDATE_ADDRESS,
    address,
  }),

  GET_TRANSACTION_COST: 'GET_TRANSACTION_COST',
  GET_TRANSACTION_COST_RETURN: 'GET_TRANSACTION_COST_RETURN',
  getTransactionCost: (txInfo) => ({
    type: appActions.GET_TRANSACTION_COST,
    txInfo,
  }),

  CLEAR_ERROR_APP: 'CLEAR_ERROR_APP',
  clearErrorApp: () => ({
    type: appActions.CLEAR_ERROR_APP,
  }),

  TOGGLE_CREATE_EVENT_DIALOG: 'TOGGLE_CREATE_EVENT_DIALOG',
  toggleCreateEventDialog: (isVisible) => ({
    type: appActions.TOGGLE_CREATE_EVENT_DIALOG,
    isVisible,
  }),

  SET_TX_CONFIRM_INFO_AND_CALLBACK: 'SET_TX_CONFIRM_INFO_AND_CALLBACK',
  setTxConfirmInfoAndCallback: (txDesc, txAmount, txToken, txInfo, confirmCallback) => ({
    type: appActions.SET_TX_CONFIRM_INFO_AND_CALLBACK,
    txDesc,
    txAmount,
    txToken,
    txInfo,
    confirmCallback,
  }),

  CLEAR_TX_CONFIRM: 'CLEAR_TX_CONFIRM',
  clearTxConfirm: () => ({
    type: appActions.CLEAR_TX_CONFIRM,
  }),
};
export default appActions;
