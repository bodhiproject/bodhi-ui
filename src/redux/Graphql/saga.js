import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { queryAllTopics, queryAllOracles } from '../../network/graphRequest';
import { createTopic, createBetTx, createSetResultTx, createVoteTx, createFinalizeResultTx, createWithdrawTx }
  from '../../network/graphMutation';
import Config from '../../config/app';
import { convertBNHexStrToQtum, decimalToBotoshi } from '../../helpers/utility';

// Send allTopics query
export function* getTopicsHandler() {
  yield takeEvery(actions.GET_TOPICS, function* getTopicsRequest(action) {
    try {
      const result = yield call(queryAllTopics, action.filters, action.orderBy);
      const topics = _.map(result, processTopic);

      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: topics,
      });
    } catch (err) {
      yield put({
        type: actions.GET_TOPICS_RETURN,
        error: err.message,
      });
    }
  });
}

function processTopic(topic) {
  if (!topic) {
    return undefined;
  }

  const newTopic = _.assign({}, topic);
  newTopic.qtumAmount = _.map(topic.qtumAmount, convertBNHexStrToQtum);
  newTopic.botAmount = _.map(topic.botAmount, convertBNHexStrToQtum);
  newTopic.oracles = _.map(topic.oracles, processOracle);
  return newTopic;
}

export function* getOraclesHandler() {
  yield takeEvery(actions.GET_ORACLES, function* getOraclesRequest(action) {
    try {
      const result = yield call(queryAllOracles, action.filters, action.orderBy);
      const oracles = _.map(result, processOracle);

      yield put({
        type: actions.GET_ORACLES_RETURN,
        value: oracles,
      });
    } catch (err) {
      yield put({
        type: actions.GET_ORACLES_RETURN,
        error: err.message,
      });
    }
  });
}

function processOracle(oracle) {
  if (!oracle) {
    return undefined;
  }

  const newOracle = _.assign({}, oracle);
  newOracle.amounts = _.map(oracle.amounts, convertBNHexStrToQtum);
  newOracle.consensusThreshold = convertBNHexStrToQtum(oracle.consensusThreshold);
  return newOracle;
}

// Sends createTopic mutation
export function* createTopicTxHandler() {
  yield takeEvery(actions.CREATE_TOPIC_TX, function* createTopicTxRequest(action) {
    try {
      const tx = yield call(
        createTopic,
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
        value: tx.data.createTopic,
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
        action.params.version,
        action.params.contractAddress,
        action.params.index,
        action.params.amount,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_BET_TX_RETURN,
        value: tx.data.createBet,
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
        value: tx.data.setResult,
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
        value: tx.data.createVote,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_VOTE_TX_RETURN,
        error: err.message,
      });
    }
  });
}

// Send finalizeResult mutation
export function* createFinalizeResultTxHandler() {
  yield takeEvery(actions.CREATE_FINALIZE_RESULT_TX, function* createFinalizeResultTxRequest(action) {
    try {
      const tx = yield call(
        createFinalizeResultTx,
        Config.defaults.version,
        action.params.oracleAddress,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_FINALIZE_RESULT_TX_RETURN,
        value: tx.data.finalizeResult,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_FINALIZE_RESULT_TX_RETURN,
        error: err.message,
      });
    }
  });
}

// Send withdraw mutation
export function* createWithdrawTxHandler() {
  yield takeEvery(actions.CREATE_WITHDRAW_TX, function* createWithdrawTxRequest(action) {
    try {
      const tx = yield call(
        createWithdrawTx,
        Config.defaults.version,
        action.params.topicAddress,
        action.params.senderAddress,
      );

      yield put({
        type: actions.CREATE_WITHDRAW_TX_RETURN,
        value: tx.data.withdraw,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_WITHDRAW_TX_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* graphqlSaga() {
  yield all([
    fork(getTopicsHandler),
    fork(getOraclesHandler),
    fork(createTopicTxHandler),
    fork(createBetTxHandler),
    fork(createSetResultTxHandler),
    fork(createVoteTxHandler),
    fork(createFinalizeResultTxHandler),
    fork(createWithdrawTxHandler),
  ]);
}
