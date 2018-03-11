import _ from 'lodash';
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import { request } from '../../network/httpRequest';
import { querySyncInfo } from '../../network/graphQuery';
import Routes from '../../network/routes';

export function* syncInfoRequestHandler() {
  yield takeEvery(actions.GET_SYNC_INFO, function* syncInfoRequest(action) {
    try {
      const result = yield call(querySyncInfo);

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
      const result = yield call(request, Routes.insightTotals);

      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

// Checks if the wallet is encrypted
export function* getWalletInfoRequestHandler() {
  yield takeEvery(actions.CHECK_WALLET_ENCRYPTED, function* getWalletInfoRequest() {
    try {
      const result = yield call(request, Routes.getWalletInfo);
      const isEncrypted = 'unlocked_until' in result.result;

      yield put({
        type: actions.CHECK_WALLET_ENCRYPTED_RETURN,
        value: isEncrypted,
      });
    } catch (error) {
      yield put({
        type: actions.CHECK_WALLET_ENCRYPTED_RETURN,
        error: error.message,
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
      yield call(request, Routes.unlockWallet, options);

      // Get the unlocked_until timestamp
      const result = yield call(request, Routes.getWalletInfo);
      const unlockedUntil = result.result.unlocked_until;

      yield put({
        type: actions.UNLOCK_WALLET_RETURN,
        value: unlockedUntil,
      });
    } catch (error) {
      yield put({
        type: actions.UNLOCK_WALLET_RETURN,
        error: error.message,
      });
    }
  });
}

export default function* appSaga() {
  yield all([
    fork(syncInfoRequestHandler),
    fork(onSyncInfoHandler),
    fork(getInsightTotalsRequestHandler),
    fork(unlockWalletRequestHandler),
  ]);
}
