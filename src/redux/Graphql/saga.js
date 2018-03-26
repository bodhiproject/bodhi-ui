import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { queryAllTopics, queryAllOracles, queryAllVotes, queryAllTransactions } from '../../network/graphQuery';
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
import { decimalToSatoshi, satoshiToDecimal, gasToQtum, getUniqueVotes } from '../../helpers/utility';
import { Token, OracleStatus, EventStatus, TransactionType, TransactionStatus } from '../../constants';
import { request } from '../../network/httpRequest';

// Send allTopics query
export function* getTopicsHandler() {
  yield takeEvery(actions.GET_TOPICS, function* getTopicsRequest(action) {
    try {
      const result = yield call(queryAllTopics, action.filters, action.orderBy, action.limit, action.skip);

      // Filter out duplicate topics
      const topics = [];
      _.each(result, (topic) => {
        const processed = processTopic(topic);
        const index = _.findIndex(topics, { txid: topic.txid });
        if (index === -1) {
          topics.push(processed);
        } else if (!topics[index].address) {
          topics.splice(index, 1, processed);
        }
      });

      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: topics,
        limit: action.limit,
        skip: action.skip,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
      });
    }
  });
}

// Send allTopics query for actionable topics: topics you can withdraw escrow and topics that you won
export function* getActionableTopicsHandler() {
  yield takeEvery(actions.GET_ACTIONABLE_TOPICS, function* getActionableTopicsRequest(action) {
    try {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(action.walletAddresses, (item) => {
        voteFilters.push({ voterQAddress: item.address });
        topicFilters.push({ status: OracleStatus.Withdraw, creatorAddress: item.address });
      });

      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Filter out unique votes by voter address, topic address, and option index
      const filtered = [];
      const votes = yield call(queryAllVotes, voteFilters);
      _.each(votes, (vote) => {
        if (!_.find(filtered, {
          voterQAddress: vote.voterQAddress,
          topicAddress: vote.topicAddress,
          optionIdx: vote.optionIdx,
        })) {
          filtered.push(vote);
        }
      });

      // Fetch topics against votes that have the winning result index
      _.each(filtered, (vote) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: vote.topicAddress, resultIdx: vote.optionIdx });
      });
      const result = yield call(queryAllTopics, topicFilters, action.orderBy, action.limit, action.skip);
      const topics = _.map(result, processTopic);

      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: topics,
        limit: action.limit,
        skip: action.skip,
      });
    } catch (err) {
      console.log(err);
      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
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
      const result = yield call(queryAllOracles, action.filters, action.orderBy, action.limit, action.skip);

      // Filter out duplicate topics
      const oracles = [];
      _.each(result, (oracle) => {
        const processed = processOracle(oracle);
        const index = _.findIndex(oracles, { txid: oracle.txid });
        if (index === -1) {
          oracles.push(processed);
        } else if (!oracles[index].address) {
          oracles.splice(index, 1, processed);
        }
      });

      yield put({
        type: actions.GET_ORACLES_RETURN,
        value: oracles,
        limit: action.limit,
        skip: action.skip,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: actions.GET_ORACLES_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
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

// Send allTransactions query for pending txs only
export function* getPendingTransactionsHandler() {
  yield takeEvery(actions.GET_PENDING_TRANSACTIONS, function* getPendingTransactionsRequest(action) {
    try {
      const filters = [{ status: TransactionStatus.Pending }];
      const result = yield call(queryAllTransactions, filters);
      const txs = _.map(result, processTransaction);

      const pendingTxsObj = {
        count: txs.length,
        createEvent: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveCreateEvent || tx.type === TransactionType.CreateEvent),
        bet: _.filter(txs, { type: TransactionType.Bet }),
        setResult: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveSetResult || tx.type === TransactionType.SetResult),
        vote: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveVote || tx.type === TransactionType.Vote),
        finalizeResult: _.filter(txs, { type: TransactionType.FinalizeResult }),
        withdraw: _.filter(txs, { type: TransactionType.Withdraw }),
        transfer: _.filter(txs, { type: TransactionType.Transfer }),
      };

      yield put({
        type: actions.GET_PENDING_TRANSACTIONS_RETURN,
        value: pendingTxsObj,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: actions.GET_PENDING_TRANSACTIONS_RETURN,
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
    if (tx.type !== TransactionType.ApproveCreateEvent
      && tx.type !== TransactionType.ApproveSetResult
      && tx.type !== TransactionType.ApproveVote) {
      newTx.amount = satoshiToDecimal(tx.amount);
    } else {
      // Don't show the amount for any approves
      newTx.amount = undefined;
    }

    newTx.fee = gasToQtum(tx.gasUsed);
  } else if (tx.token && tx.token === Token.Qtum && tx.type === TransactionType.Transfer) {
    // Process sendtoaddress
    newTx.fee = gasToQtum(tx.gasUsed);
  }
  return newTx;
}

// Gets the number of actionable items; setResult, finalize, withdraw
export function* getActionableItemCountHandler() {
  yield takeEvery(actions.GET_ACTIONABLE_ITEM_COUNT, function* getActionableItemCountRequest(action) {
    const actionItems = {
      [EventStatus.Set]: 0,
      [EventStatus.Finalize]: 0,
      [EventStatus.Withdraw]: 0,
      totalCount: 0,
    };

    try {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(action.walletAddresses, (item) => {
        voteFilters.push({ voterQAddress: item.address });
        topicFilters.push({ status: OracleStatus.Withdraw, creatorAddress: item.address });
      });

      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Fetch topics against votes that have the winning result index
      _.each(votes, (vote) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: vote.topicAddress, resultIdx: vote.optionIdx });
      });
      let result = yield call(queryAllTopics, topicFilters);
      actionItems[EventStatus.Withdraw] = result.length;
      actionItems.totalCount += result.length;

      // Get result set items
      const oracleSetFilters = [{ token: Token.Qtum, status: OracleStatus.OpenResultSet }];
      _.each(action.walletAddresses, (item) => {
        oracleSetFilters.push({
          token: Token.Qtum,
          status: OracleStatus.WaitResult,
          resultSetterQAddress: item.address,
        });
      });

      result = yield call(queryAllOracles, oracleSetFilters);
      actionItems[EventStatus.Set] = result.length;
      actionItems.totalCount += result.length;

      // Get finalize items
      const oracleFinalizeFilters = [
        { token: Token.Bot, status: OracleStatus.WaitResult },
      ];
      result = yield call(queryAllOracles, oracleFinalizeFilters);
      actionItems[EventStatus.Finalize] = result.length;
      actionItems.totalCount += result.length;

      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: actionItems,
      });
    } catch (err) {
      console.log(err);
      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: {
          [EventStatus.Set]: 0,
          [EventStatus.Finalize]: 0,
          [EventStatus.Withdraw]: 0,
          totalCount: 0,
        },
      });
    }
  });
}

// Sends createTopic mutation
export function* createTopicTxHandler() {
  yield takeEvery(actions.CREATE_TOPIC_TX, function* createTopicTxRequest(action) {
    try {
      const escrowAmountBotoshi = decimalToSatoshi(action.params.escrowAmount);

      const tx = yield call(
        createTopic,
        action.params.name,
        action.params.results,
        action.params.centralizedOracle,
        action.params.bettingStartTime,
        action.params.bettingEndTime,
        action.params.resultSettingStartTime,
        action.params.resultSettingEndTime,
        escrowAmountBotoshi,
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
        action.params.type,
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
    fork(getActionableTopicsHandler),
    fork(getOraclesHandler),
    fork(getTransactionsHandler),
    fork(getPendingTransactionsHandler),
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
