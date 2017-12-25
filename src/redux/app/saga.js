import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../helpers/utility';

export function* listUnspentRequestHandler() {
  yield takeEvery(actions.LIST_UNSPENT, function* listUnspentRequest() {
    try {
      const result = yield call(request, 'http://localhost:8080/listunspent');

      yield put({
        type: actions.LIST_UNSPENT_RESULT,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.LIST_UNSPENT_RESULT,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* getBlockCountRequestHandler() {
  yield takeEvery(actions.GET_BLOCK_COUNT, function* getBlockCountRequest() {
    try {
      const result = yield call(request, 'http://localhost:8080/getblockcount');

      yield put({
        type: actions.GET_BLOCK_COUNT_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BLOCK_COUNT_RETURN,
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

      const result = yield call(request, 'http://localhost:8080/botbalance', options);

      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(listUnspentRequestHandler),
    fork(getBlockCountRequestHandler),
    fork(getBotBalanceRequestHandler),
  ]);
}
