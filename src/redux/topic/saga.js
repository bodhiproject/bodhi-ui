import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../helpers/utility';

export function* betRequestHandler() {
  yield takeEvery(actions.BET, function* onBetRequest(action) {
    const {
      contractAddress, index, amount, senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          index,
          amount,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, 'http://localhost:8080/bet', options);

      console.log('onBetRequest: result is', result);

      yield put({
        type: actions.BET_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.BET_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* setResultRequestHandler() {
  yield takeEvery(actions.SET_RESULT, function* onSetResultRequest(action) {
    const {
      contractAddress, resultIndex, senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          resultIndex,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, 'http://localhost:8080/setresult', options);
      console.log('setResultReturn result: ', result);

      yield put({
        type: actions.SET_RESULT_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.SET_RESULT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* finalizeResultRequestHandler() {
  yield takeEvery(actions.FINALIZE_RESULT, function* onFinalizeResultRequest(action) {
    const {
      contractAddress, senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, 'http://localhost:8080/finalizeresult', options);
      console.log('finalizeResult return: ', result);

      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(betRequestHandler),
    fork(setResultRequestHandler),
    fork(finalizeResultRequestHandler),
  ]);
}
