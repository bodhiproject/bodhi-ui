import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../helpers/utility';

export function* listUnspentRequestHandler() {
  yield takeEvery(actions.LIST_UNSPENT, function* listUnspentRequest() {
    try {
      const result = yield call(request, 'http://localhost:8080/listunspent');

      console.log('listUnspentRequest: result is', result);

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

export default function* topicSaga() {
  yield all([
    fork(listUnspentRequestHandler),
  ]);
}
