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
        type: actions.BET_RESULT,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.BET_RESULT,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(betRequestHandler),
  ]);
}
