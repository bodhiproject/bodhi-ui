import _ from 'lodash';
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import moment from 'moment';

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
      console.error(error.message);
    }
  });
}

// Checks if the wallet is encrypted
export function* getWalletInfoRequestHandler() {
  yield takeEvery(actions.CHECK_WALLET_ENCRYPTED, function* getWalletInfoRequest() {
    try {
      const result = yield call(request, Routes.api.getWalletInfo);

      let isEncrypted = false;
      if (result && result.result && result.result.unlocked_until) {
        const now = moment().unix();
        const unlockedUntil = moment().unix(result.result.unlocked_until);
        isEncrypted = now.isBefore(unlockedUntil);
      }

      yield put({
        type: actions.CHECK_WALLET_ENCRYPTED_RETURN,
        value: isEncrypted,
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
      const unlockedUntil = result.result.unlocked_until;

      yield put({
        type: actions.UNLOCK_WALLET_RETURN,
        value: unlockedUntil,
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
    fork(getInsightTotalsRequestHandler),
    fork(getWalletInfoRequestHandler),
    fork(unlockWalletRequestHandler),
  ]);
}
