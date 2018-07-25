import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import axios from '../../network/httpRequest';
import Routes from '../../network/routes';
import { querySyncInfo } from '../../network/graphQuery';

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

export default function* appSaga() {
  yield all([
    fork(syncInfoRequestHandler),
    fork(onSyncInfoHandler),
    fork(getInsightTotalsRequestHandler),
    fork(validateAddressRequestHandler),
    fork(getTransactionCostRequestHandler),
  ]);
}
