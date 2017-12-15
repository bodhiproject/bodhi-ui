import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../helpers/utility';

export function* betRequestHandler() {
  yield takeEvery(actions.BET, function* onBetRequest(action) {
    const {
      contractAddress,
      index,
      amount,
      senderAddress,
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

export function* createRequestHandler() {
  yield takeEvery(actions.CREATE, function* onCreateRequest(action) {
    const {
      resultSetterAddress,
      name,
      options,
      bettingEndBlock,
      resultSettingEndBlock,
    } = action.payload;

    console.log('action:createRequestHandler', resultSetterAddress, name, options, bettingEndBlock, resultSettingEndBlock);

    try {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          oracleAddress: resultSetterAddress,
          eventName: name,
          options,
          bettingEndBlock,
          resultSettingEndBlock,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, 'http://localhost:8080/createtopic', requestOptions);

      console.log('onCreateRequest: result is', result);

      yield put({
        type: actions.CREATE_RESULT,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.CREATE_RESULT,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(betRequestHandler),
    fork(createRequestHandler),
  ]);
}
