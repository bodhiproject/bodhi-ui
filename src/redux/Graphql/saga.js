import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { defineMessages } from 'react-intl';
import _ from 'lodash';
import { Token, OracleStatus, EventStatus, TransactionType, TransactionStatus, Phases } from 'constants';

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
import {
  decimalToSatoshi,
  satoshiToDecimal,
  gasToQtum,
  processTopic,
  processOracle,
  getPhase,
} from '../../helpers/utility';
import Routes from '../../network/routes';
const { PENDING } = TransactionStatus;
const { RESULT_SETTING, FINALIZING } = Phases;

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  pending: { id: 'str.pending', defaultMessage: 'PENDING' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
});

/**
 * Adds computed properties to each oracle used throughout the app
 */
const massageOracles = (oracles) => oracles.map((oracle) => {
  const phase = getPhase(oracle);

  const { APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE, FINALIZE_RESULT, BET } = TransactionType;
  const pendingTypes = {
    BETTING: [BET],
    RESULT_SETTING: [APPROVE_SET_RESULT, SET_RESULT],
    VOTING: [APPROVE_VOTE, VOTE],
    FINALIZING: [FINALIZE_RESULT],
  }[phase] || [];
  const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING);

  const isUpcoming = phase === RESULT_SETTING && oracle.status === OracleStatus.WAIT_RESULT;

  const buttonText = {
    BETTING: messages.placeBet,
    RESULT_SETTING: messages.setResult,
    VOTING: messages.arbitrate,
    PENDING: messages.pending,
    FINALIZING: messages.finalizeResult,
    WITHDRAWING: messages.withdraw,
  }[phase];

  const amount = parseFloat(_.sum(oracle.amounts)).toFixed(2);

  return {
    amountLabel: phase !== FINALIZING ? `${amount} ${oracle.token}` : '',
    url: `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`,
    endTime: phase === RESULT_SETTING ? oracle.resultSetEndTime : oracle.endTime,
    unconfirmed: (!oracle.topicAddress && !oracle.address) || isPending,
    isUpcoming,
    buttonText,
    phase,
    ...oracle,
  };
});

/**
* Adds computed properties to each topic used throughout the app
*/
const massageTopics = (topics) => topics.map((topic) => {
  const pendingTypes = [TransactionType.WITHDRAW_ESCROW, TransactionType.WITHDRAW];
  const isPending = topic.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === PENDING);

  const totalQTUM = parseFloat(_.sum(topic.qtumAmount).toFixed(2));
  const totalBOT = parseFloat(_.sum(topic.botAmount).toFixed(2));
  return {
    ...topic,
    amountLabel: `${totalQTUM} QTUM, ${totalBOT} BOT`,
    url: `/topic/${topic.address}`,
    isUpcoming: false,
    buttonText: messages.withdraw,
    unconfirmed: isPending,
  };
});

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
        value: massageTopics(topics),
        limit: action.limit,
        skip: action.skip,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
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
        topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address });
      });

      // Filter votes
      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Fetch topics against votes that have the winning result index
      _.each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx });
      });
      const result = yield call(queryAllTopics, topicFilters, action.orderBy, action.limit, action.skip);
      const topics = _.map(result, processTopic);

      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: massageTopics(topics),
        limit: action.limit,
        skip: action.skip,
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
      yield put({
        type: actions.GET_TOPICS_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
      });
    }
  });
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
        value: massageOracles(oracles),
        limit: action.limit,
        skip: action.skip,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
      yield put({
        type: actions.GET_ORACLES_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
      });
    }
  });
}

// Send allTransactions query
export function* getTransactionsHandler() {
  yield takeEvery(actions.GET_TRANSACTIONS, function* getTransactionsRequest(action) {
    try {
      const result = yield call(queryAllTransactions, action.filters, action.orderBy, action.limit, action.skip);
      const txs = _.map(result, processTransaction);

      yield put({
        type: actions.GET_TRANSACTIONS_RETURN,
        value: txs,
        limit: action.limit,
        skip: action.skip,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
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
  newTx.gasLimit = Number(tx.gasLimit);
  newTx.gasPrice = Number(tx.gasPrice);
  newTx.fee = gasToQtum(tx.gasUsed);

  if (tx.token && tx.token === Token.BOT) {
    if (tx.type !== TransactionType.APPROVE_CREATE_EVENT
      && tx.type !== TransactionType.APPROVE_SET_RESULT
      && tx.type !== TransactionType.APPROVE_VOTE) {
      newTx.amount = satoshiToDecimal(tx.amount);
    } else {
      // Don't show the amount for any approves
      newTx.amount = undefined;
    }
  }
  return newTx;
}

// Gets the number of actionable items; setResult, finalize, withdraw
export function* getActionableItemCountHandler() {
  yield takeEvery(actions.GET_ACTIONABLE_ITEM_COUNT, function* getActionableItemCountRequest(action) {
    const actionItems = {
      [EventStatus.SET]: 0,
      [EventStatus.FINALIZE]: 0,
      [EventStatus.WITHDRAW]: 0,
      totalCount: 0,
    };

    try {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(action.walletAddresses, (item) => {
        voteFilters.push({ voterQAddress: item.address });
        topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address });
      });

      // Filter votes
      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Fetch topics against votes that have the winning result index
      _.each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx });
      });
      let result = yield call(queryAllTopics, topicFilters);
      actionItems[EventStatus.WITHDRAW] = result.length;
      actionItems.totalCount += result.length;

      // Get result set items
      const oracleSetFilters = [{ token: Token.QTUM, status: OracleStatus.OPEN_RESULT_SET }];
      _.each(action.walletAddresses, (item) => {
        oracleSetFilters.push({
          token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          resultSetterQAddress: item.address,
        });
      });

      result = yield call(queryAllOracles, oracleSetFilters);
      actionItems[EventStatus.SET] = result.length;
      actionItems.totalCount += result.length;

      // Get finalize items
      const oracleFinalizeFilters = [
        { token: Token.BOT, status: OracleStatus.WAIT_RESULT },
      ];
      result = yield call(queryAllOracles, oracleFinalizeFilters);
      actionItems[EventStatus.FINALIZE] = result.length;
      actionItems.totalCount += result.length;

      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: actionItems,
      });
    } catch (err) {
      console.log(err); // eslint-disable-line
      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: {
          [EventStatus.SET]: 0,
          [EventStatus.FINALIZE]: 0,
          [EventStatus.WITHDRAW]: 0,
          totalCount: 0,
        },
      });
    }
  });
}

/*
* Filter out unique votes by voter address, topic address, and option index.
* Used to query against Topics that you can win.
*/
function getUniqueVotes(votes) {
  const filtered = [];
  _.each(votes, (v) => {
    const { voterQAddress, topicAddress, optionIdx } = v;
    if (!_.find(filtered, { voterQAddress, topicAddress, optionIdx })) {
      filtered.push(v);
    }
  });
  return filtered;
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
    } catch (error) {
      yield put({
        type: actions.CREATE_TOPIC_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createTopicTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_BET_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createBetTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_SET_RESULT_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createSetResultTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_VOTE_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createVoteTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_FINALIZE_RESULT_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createFinalizeResultTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_WITHDRAW_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createWithdrawTx`,
        },
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
    } catch (error) {
      yield put({
        type: actions.CREATE_TRANSFER_TX_RETURN,
        error: {
          ...error,
          route: `${Routes.graphql.http}/createTransferTx`,
        },
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
