import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import { createTopic, createBetTx, createSetResultTx } from '../../../network/graphMutation';
import Config from '../../../config/app';
import { decimalToBotoshi } from '../../../helpers/utility';

// Sends createTopic mutation
export function* createTopicRequestHandler() {
  yield takeEvery(actions.CREATE_TOPIC, function* createTopicRequest(action) {
    try {
      const tx = yield call(
        createTopic,
        Config.defaults.version,
        action.params.name,
        action.params.results,
        action.params.centralizedOracle,
        action.params.bettingStartTime,
        action.params.bettingEndTime,
        action.params.resultSettingStartTime,
        action.params.resultSettingEndTime,
        action.params.senderAddress
      );

      yield put({
        type: actions.CREATE_TOPIC_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_TOPIC_RETURN,
        error: err.message,
      });
    }
  });
}

// Sends createBet mutation
export function* createBetRequestHandler() {
  yield takeEvery(actions.CREATE_BET, function* createBetRequest(action) {
    try {
      const tx = yield call(
        createBetTx,
        Config.defaults.version,
        action.params.contractAddress,
        action.params.index,
        action.params.amount,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_BET_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_BET_RETURN,
        error: err.message,
      });
    }
  });
}

// Sends setResult mutation
export function* createSetResultRequestHandler() {
  yield takeEvery(actions.CREATE_SET_RESULT, function* createSetResultRequest(action) {
    try {
      // Convert consensus threshold amount to Botoshi
      const botoshi = decimalToBotoshi(action.params.consensusThreshold);

      const tx = yield call(
        createSetResultTx,
        Config.defaults.version,
        action.params.topicAddress,
        action.params.oracleAddress,
        action.params.index,
        botoshi,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_SET_RESULT_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_SET_RESULT_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* graphqlSaga() {
  yield all([
    fork(createTopicRequestHandler),
    fork(createBetRequestHandler),
    fork(createSetResultRequestHandler),
  ]);
}
