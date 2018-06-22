import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import axios from '../../network/httpRequest';
import { querySyncInfo } from '../../network/graphQuery';
import Routes from '../../network/routes';

export function* syncInfoRequestHandler() {
  yield takeEvery(actions.GET_SYNC_INFO, function* syncInfoRequest(action) {
    try {
      const includeBalances = action.syncPercent === 0 || action.syncPercent >= 98;
      const result = yield call(querySyncInfo, includeBalances);

      yield put({
        type: actions.SYNC_INFO_RETURN,
        syncInfo: result,
      });
    } catch (error) {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        error: error.message,
      });
    }
  });
}

export function* onSyncInfoHandler() {
  yield takeEvery(actions.ON_SYNC_INFO, function* onSyncInfo(action) {
    if (action.syncInfo.error) {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        error: action.syncInfo.error,
      });
    } else {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        syncInfo: action.syncInfo,
      });
    }
  });
}

// Get the total statistics from the Qtum Insight API
export function* getInsightTotalsRequestHandler() {
  yield takeEvery(actions.GET_INSIGHT_TOTALS, function* getInsightTotalsRequest() {
    try {
      const { data } = yield axios.get(Routes.insight.totals);
      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        timeBetweenBlocks: data.time_between_blocks,
      });
    } catch (error) {
      console.error(error.message); // eslint-disable-line
    }
  });
}

// Change wallet passphrase
export function* changePassphraseRequestHandler() {
  yield takeEvery(actions.CHANGE_PASSPHRASE, function* changePassphraseRequest(action) {
    try {
      const changePassphraseResult = yield axios.post(Routes.api.walletPassphraseChange, {
        oldPassphrase: action.oldPassphrase,
        newPassphrase: action.newPassphrase,
      });
      yield put({
        type: actions.CHANGE_PASSPHRASE_RETURN,
        changePassphraseResult,
      });
    } catch (error) {
      yield put({
        type: actions.CHANGE_PASSPHRASE_RETURN,
        error: {
          route: Routes.api.walletPassphraseChange,
          message: error.message,
        },
      });
    }
  });
}

// Backup the wallet
export function* backupWalletRequestHandler() {
  yield takeEvery(actions.BACKUP_WALLET, function* backupWalletRequest() {
    try {
      yield axios.post(Routes.api.backupWallet);
    } catch (error) {
      yield put({
        type: actions.BACKUP_WALLET_RETURN,
        error: {
          route: Routes.api.backupWallet,
          message: error.message,
        },
      });
    }
  });
}

// Import the wallet
export function* importWalletRequestHandler() {
  yield takeEvery(actions.IMPORT_WALLET, function* importWalletRequest() {
    try {
      yield axios.post(Routes.api.importWallet);
    } catch (error) {
      yield put({
        type: actions.IMPORT_WALLET_RETURN,
        error: {
          route: Routes.api.importWallet,
          message: error.message,
        },
      });
    }
  });
}

// Checks if the wallet is encrypted
export function* checkWalletEncryptedRequestHandler() {
  yield takeEvery(actions.CHECK_WALLET_ENCRYPTED, function* checkWalletEncryptedRequest() {
    try {
      const { data: { result } } = yield axios.get(Routes.api.getWalletInfo);
      const isEncrypted = result && !_.isUndefined(result.unlocked_until);
      const unlockedUntil = result && result.unlocked_until ? result.unlocked_until : 0;

      yield put({
        type: actions.CHECK_WALLET_ENCRYPTED_RETURN,
        isEncrypted,
        unlockedUntil,
      });
    } catch (error) {
      yield put({
        type: actions.CHECK_WALLET_ENCRYPTED_RETURN,
        error: {
          route: Routes.api.getWalletInfo,
          message: error.message,
        },
      });
    }
  });
}

// Checks if the address is valid
export function* validateAddressRequestHandler() {
  yield takeEvery(actions.VALIDATE_ADDRESS, function* validateAddressRequest(action) {
    try {
      const { data: { result } } = yield axios.post(Routes.api.validateAddress, {
        address: action.address,
      });
      yield put({
        type: actions.VALIDATE_ADDRESS_RETURN,
        value: result.isvalid,
      });
    } catch (err) {
      yield put({
        type: actions.VALIDATE_ADDRESS_RETURN,
        error: {
          route: Routes.api.validateAddress,
          message: err.message,
        },
      });
    }
  });
}

// Get transaction cost
export function* getTransactionCostRequestHandler() {
  yield takeEvery(actions.GET_TRANSACTION_COST, function* getTransactionCostRequest(action) {
    try {
      const { data: { result } } = yield axios.post(Routes.api.transactionCost, action.txInfo);
      yield put({
        type: actions.GET_TRANSACTION_COST_RETURN,
        value: result,
      });
    } catch (err) {
      yield put({
        type: actions.GET_TRANSACTION_COST_RETURN,
        error: {
          route: Routes.api.transactionCost,
          message: err.message,
        },
      });
    }
  });
}

// Unlocks your encrypted wallet with the passphrase
export function* unlockWalletRequestHandler() {
  yield takeEvery(actions.UNLOCK_WALLET, function* unlockWalletRequest(action) {
    try {
      const timeoutSec = action.timeout * 60;

      // Unlock the wallet
      yield axios.post(Routes.api.unlockWallet, {
        passphrase: action.passphrase,
        timeout: timeoutSec,
      });

      // Get the unlocked_until timestamp
      const { data: { result } } = yield axios.get(Routes.api.getWalletInfo);
      const unlockedUntil = result.unlocked_until;

      yield put({
        type: actions.UNLOCK_WALLET_RETURN,
        unlockedUntil,
      });
    } catch (error) {
      yield put({
        type: actions.UNLOCK_WALLET_RETURN,
        error: {
          route: Routes.api.unlockWallet,
          message: error.message,
        },
      });
    }
  });
}

export default function* appSaga() {
  yield all([
    fork(syncInfoRequestHandler),
    fork(onSyncInfoHandler),
    fork(backupWalletRequestHandler),
    fork(importWalletRequestHandler),
    fork(getInsightTotalsRequestHandler),
    fork(checkWalletEncryptedRequestHandler),
    fork(validateAddressRequestHandler),
    fork(unlockWalletRequestHandler),
    fork(getTransactionCostRequestHandler),
    fork(changePassphraseRequestHandler),
  ]);
}
