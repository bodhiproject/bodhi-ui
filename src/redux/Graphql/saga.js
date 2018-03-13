import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { queryAllTopics, queryAllOracles, queryAllTransactions } from '../../network/graphQuery';
import {
  createTopic,
  createBetTx,
  createSetResultTx,
  createVoteTx,
  createFinalizeResultTx,
  createWithdrawTx,
  createTransferTx,
} from '../../network/graphMutation';
import Config from '../../config/app';
import { decimalToSatoshi, satoshiToDecimal, gasToQtum } from '../../helpers/utility';
import { Token, OracleStatus, EventStatus } from '../../constants';

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
      console.error(err);
      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: [],
      });
    }
  });
}

function processTopic(topic) {
  if (!topic) {
    return undefined;
  }

  const newTopic = _.assign({}, topic);
  newTopic.qtumAmount = _.map(topic.qtumAmount, satoshiToDecimal);
  newTopic.botAmount = _.map(topic.botAmount, satoshiToDecimal);
  newTopic.oracles = _.map(topic.oracles, processOracle);
  return newTopic;
}

// Send allOracles query
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
      console.error(err);
      yield put({
        type: actions.GET_ORACLES_RETURN,
        value: [],
      });
    }
  });
}

function processOracle(oracle) {
  if (!oracle) {
    return undefined;
  }

  const newOracle = _.assign({}, oracle);
  newOracle.amounts = _.map(oracle.amounts, satoshiToDecimal);
  newOracle.consensusThreshold = satoshiToDecimal(oracle.consensusThreshold);
  return newOracle;
}

// Send allTransactions query
export function* getTransactionsHandler() {
  yield takeEvery(actions.GET_TRANSACTIONS, function* getTransactionsRequest(action) {
    try {
      const result = yield call(queryAllTransactions, action.filters, action.orderBy);
      const txs = _.map(result, processTransaction);

      yield put({
        type: actions.GET_TRANSACTIONS_RETURN,
        value: txs,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: actions.GET_TRANSACTIONS_RETURN,
        value: [],
      });
    }
  });
}

function processTransaction(tx) {
  if (!tx) {
    return undefined;
  }

  const newTx = _.assign({}, tx);
  if (tx.token && tx.token === Token.Bot) {
    newTx.amount = satoshiToDecimal(tx.amount);
    newTx.fee = gasToQtum(tx.gasUsed);
  }
  return newTx;
}

// Gets the number of actionable items; setResult, finalize, withdraw
export function* getActionableItemCountHandler() {
  yield takeEvery(actions.GET_ACTIONABLE_ITEM_COUNT, function* getActionableItemCountRequest(action) {
    let totalCount = 0;
    const countByStatus = {
      [EventStatus.Set]: 0,
      [EventStatus.Finalize]: 0,
      [EventStatus.Withdraw]: 0,
    };

    try {
      const topicFilters = [
        { status: OracleStatus.Withdraw },
      ];
      let result = yield call(queryAllTopics, topicFilters);
      countByStatus[EventStatus.Withdraw] = result.length;
      totalCount += result.length;

      const oracleSetFilters = [
        { token: Token.Qtum, status: OracleStatus.WaitResult, resultSetterQAddress: action.walletAddress },
        { token: Token.Qtum, status: OracleStatus.OpenResultSet },
      ];
      result = yield call(queryAllOracles, oracleSetFilters);
      countByStatus[EventStatus.Set] = result.length;
      totalCount += result.length;

      const oracleFinalizeFilters = [
        { token: Token.Bot, status: OracleStatus.WaitResult },
      ];
      result = yield call(queryAllOracles, oracleFinalizeFilters);
      countByStatus[EventStatus.Finalize] = result.length;
      totalCount += result.length;

      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: {
          totalCount,
          countByStatus,
        },
      });
    } catch (err) {
      console.log(err);
      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: {
          totalCount,
          countByStatus,
        },
      });
    }
  });
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
        action.params.topicAddress,
        action.params.oracleAddress,
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
      const botoshi = decimalToSatoshi(action.params.consensusThreshold);

      const tx = yield call(
        createSetResultTx,
        action.params.version,
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
      const botoshi = decimalToSatoshi(action.params.botAmount);

      const tx = yield call(
        createVoteTx,
        action.params.version,
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
        action.params.version,
        action.params.topicAddress,
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
        action.params.version,
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

// Send transfer mutation
export function* createTransferTxHandler() {
  yield takeEvery(actions.CREATE_TRANSFER_TX, function* createTransferTxRequest(action) {
    try {
      const tx = yield call(
        createTransferTx,
        action.params.senderAddress,
        action.params.receiverAddress,
        action.params.token,
        action.params.amount,
      );

      yield put({
        type: actions.CREATE_TRANSFER_TX_RETURN,
        value: tx.data.transfer,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_TRANSFER_TX_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* graphqlSaga() {
  yield all([
    fork(getTopicsHandler),
    fork(getOraclesHandler),
    fork(getTransactionsHandler),
    fork(getActionableItemCountHandler),
    fork(createTopicTxHandler),
    fork(createBetTxHandler),
    fork(createSetResultTxHandler),
    fork(createVoteTxHandler),
    fork(createFinalizeResultTxHandler),
    fork(createWithdrawTxHandler),
    fork(createTransferTxHandler),
  ]);
}
