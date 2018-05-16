import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { request } from '../../network/httpRequest';
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
      const result = yield call(request, Routes.insight.totals);

      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        value: { result },
      });
    } catch (error) {
      console.error(error.message); // eslint-disable-line
    }
  });
}

// Encrypt the wallet
export function* encryptWalletRequestHandler() {
  yield takeEvery(actions.ENCRYPT_WALLET, function* encryptWalletRequest(action) {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          passphrase: action.passphrase,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
      const encryptResult = yield call(request, Routes.api.encryptWallet, options);
      yield put({
        type: actions.ENCRYPT_WALLET_RETURN,
        encryptResult,
      });
    } catch (error) {
      yield put({
        type: actions.ENCRYPT_WALLET_RETURN,
        error: {
          route: Routes.api.encryptWallet,
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
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const backupResult = yield call(request, Routes.api.backupWallet, options);
      yield put({
        type: actions.BACKUP_WALLET_RETURN,
        backupResult,
      });
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
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const importResult = yield call(request, Routes.api.importWallet, options);
      yield put({
        type: actions.IMPORT_WALLET_RETURN,
        importResult,
      });
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
      const result = yield call(request, Routes.api.getWalletInfo);
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
      const options = {
        method: 'POST',
        body: JSON.stringify({
          address: action.address,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.api.validateAddress, options);

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

// Unlocks your encrypted wallet with the passphrase
export function* unlockWalletRequestHandler() {
  yield takeEvery(actions.UNLOCK_WALLET, function* unlockWalletRequest(action) {
    try {
      const timeoutSec = action.timeout * 60;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          passphrase: action.passphrase,
          timeout: timeoutSec,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
      // Unlock the wallet
      yield call(request, Routes.api.unlockWallet, options);

      // Get the unlocked_until timestamp
      const result = yield call(request, Routes.api.getWalletInfo);
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
    fork(encryptWalletRequestHandler),
    fork(backupWalletRequestHandler),
    fork(importWalletRequestHandler),
    fork(getInsightTotalsRequestHandler),
    fork(checkWalletEncryptedRequestHandler),
    fork(validateAddressRequestHandler),
    fork(unlockWalletRequestHandler),
  ]);
}
