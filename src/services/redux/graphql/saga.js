import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import { createTopic, createBetTx, createSetResultTx, createVoteTx } from '../../../network/graphMutation';
import Config from '../../../config/app';
import { decimalToBotoshi } from '../../../helpers/utility';

// Sends createTopic mutation
export function* createTopicTxHandler() {
  yield takeEvery(actions.CREATE_TOPIC_TX, function* createTopicTxRequest(action) {
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
        type: actions.CREATE_TOPIC_TX_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_TOPIC_TX_RETURN,
        error: err.message,
      });
    }
  });
}

// Sends createBet mutation
export function* createBetTxHandler() {
  yield takeEvery(actions.CREATE_BET_TX, function* createBetTxRequest(action) {
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
        type: actions.CREATE_BET_TX_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_BET_TX_RETURN,
        error: err.message,
      });
    }
  });
}

// Sends setResult mutation
export function* createSetResultTxHandler() {
  yield takeEvery(actions.CREATE_SET_RESULT_TX, function* createSetResultTxRequest(action) {
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
        type: actions.CREATE_SET_RESULT_TX_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_SET_RESULT_TX_RETURN,
        error: err.message,
      });
    }
  });
}

// Sends vote mutation
export function* createVoteTxHandler() {
  yield takeEvery(actions.CREATE_VOTE_TX, function* createVoteTxRequest(action) {
    try {
      // Convert vote amount to Botoshi
      const botoshi = decimalToBotoshi(action.params.botAmount);

      const tx = yield call(
        createVoteTx,
        Config.defaults.version,
        action.params.topicAddress,
        action.params.oracleAddress,
        action.params.resultIndex,
        botoshi,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_VOTE_TX_RETURN,
        value: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_VOTE_TX_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* graphqlSaga() {
  yield all([
    fork(createTopicTxHandler),
    fork(createBetTxHandler),
    fork(createSetResultTxHandler),
    fork(createVoteTxHandler),
  ]);
}
