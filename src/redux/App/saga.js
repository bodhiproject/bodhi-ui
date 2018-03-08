import _ from 'lodash';
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import fetch from 'node-fetch';

import actions from './actions';
import { request } from '../../network/httpRequest';
import { querySyncInfo } from '../../network/graphQuery';
import { satoshiHexToDecimal } from '../../helpers/utility';
import Routes from '../../network/routes';

const DEFAULT_QTUMD_ACCOUNTNAME = '';

export function* listUnspentRequestHandler() {
  yield takeEvery(actions.LIST_UNSPENT, function* listUnspentRequest() {
    try {
      const result = yield call(request, Routes.listUnspent);

      if (_.isEmpty(result)) {
        // If listunspent return is empty meaning one has no balance in his addresses
        // we will get default qtumd account's address
        // This is likely to be the case when first installed
        const options = {
          method: 'POST',
          body: JSON.stringify({
            accountName: DEFAULT_QTUMD_ACCOUNTNAME,
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        const defaultAddress = yield call(request, Routes.getAccountAddress, options);

        yield put({
          type: actions.LIST_UNSPENT_RETURN,
          value: {
            result: [{
              address: defaultAddress,
              amount: 0,
            }],
          },
        });
      } else {
        // If listunspent returns with a non-empty list
        yield put({
          type: actions.LIST_UNSPENT_RETURN,
          value: { result },
        });
      }
    } catch (error) {
      yield put({
        type: actions.LIST_UNSPENT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* getBotBalanceRequestHandler() {
  yield takeEvery(actions.GET_BOT_BALANCE, function* getBotBalanceRequest(action) {
    try {
      const {
        owner,
        senderAddress,
      } = action.payload;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          owner,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.botBalance, options);
      const botValue = result && result.balance ? satoshiHexToDecimal(result.balance) : 0;

      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: {
          address: owner,
          value: botValue,
        },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

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

export default function* topicSaga() {
  yield all([
    fork(listUnspentRequestHandler),
    fork(getBotBalanceRequestHandler),
    fork(syncInfoRequestHandler),
    fork(onSyncInfoHandler),
    fork(getInsightTotalsRequestHandler),
  ]);
}
