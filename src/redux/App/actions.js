
const appActions = {
  BACKUP_WALLET: 'BACKUP_WALLET',
  BACKUP_WALLET_RETURN: 'BACKUP_WALLET_RETURN',
  backupWallet: (destination) => ({
    type: appActions.BACKUP_WALLET,
    destination,
  }),

  CHANGE_PASSPHRASE: 'CHANGE_PASSPHRASE',
  CHANGE_PASSPHRASE_RETURN: 'CHANGE_PASSPHRASE_RETURN',
  changePassphrase: (oldPassphrase, newPassphrase) => ({
    type: appActions.CHANGE_PASSPHRASE,
    oldPassphrase,
    newPassphrase,
  }),

  IMPORT_WALLET: 'IMPORT_WALLET',
  IMPORT_WALLET_RETURN: 'IMPORT_WALLET_RETURN',
  importWallet: (destination) => ({
    type: appActions.IMPORT_WALLET,
    destination,
  }),

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

  TOGGLE_WALLET_UNLOCK_DIALOG: 'TOGGLE_WALLET_UNLOCK_DIALOG',
  toggleWalletUnlockDialog: (isVisible) => ({
    type: appActions.TOGGLE_WALLET_UNLOCK_DIALOG,
    isVisible,
  }),

  CHECK_WALLET_ENCRYPTED: 'CHECK_WALLET_ENCRYPTED',
  CHECK_WALLET_ENCRYPTED_RETURN: 'CHECK_WALLET_ENCRYPTED_RETURN',
  checkWalletEncrypted: () => ({
    type: appActions.CHECK_WALLET_ENCRYPTED,
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

  UNLOCK_WALLET: 'UNLOCK_WALLET',
  UNLOCK_WALLET_RETURN: 'UNLOCK_WALLET_RETURN',
  unlockWallet: (passphrase, timeout) => ({
    type: appActions.UNLOCK_WALLET,
    passphrase,
    timeout,
  }),

  CLEAR_ERROR_APP: 'CLEAR_ERROR_APP',
  clearErrorApp: () => ({
    type: appActions.CLEAR_ERROR_APP,
  }),

  TOGGLE_PENDING_TXS_SNACKBAR: 'TOGGLE_PENDING_TXS_SNACKBAR',
  togglePendingTxsSnackbar: (isVisible) => ({
    type: appActions.TOGGLE_PENDING_TXS_SNACKBAR,
    isVisible,
  }),

  TOGGLE_GLOBAL_SNACKBAR: 'TOGGLE_GLOBAL_SNACKBAR',
  toggleGlobalSnackbar: (isVisible, message) => ({
    type: appActions.TOGGLE_GLOBAL_SNACKBAR,
    isVisible,
    message,
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

  CLEAR_CHANGE_PASSPHRASE_RESULT: 'CLEAR_CHANGE_PASSPHRASE_RESULT',
  clearChangePassphraseResult: () => ({
    type: appActions.CLEAR_CHANGE_PASSPHRASE_RESULT,
  }),
};
export default appActions;
