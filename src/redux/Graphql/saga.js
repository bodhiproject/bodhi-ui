import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { defineMessages } from 'react-intl';
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
import {
  decimalToSatoshi,
  satoshiToDecimal,
  gasToQtum,
  processTopic,
  processOracle,
} from '../../helpers/utility';
import { Token, OracleStatus, EventStatus, TransactionType, TransactionStatus } from '../../constants';
import Routes from '../../network/routes';
const { Pending } = TransactionStatus;

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
});

/**
 * Takes an oracle object and returns which phase it is in.
 * @param {oracle} oracle
 */
const getPhase = ({ token, status }) => {
  const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
  if (QTUM && ['VOTING', 'CREATED'].includes(status)) return 'betting';
  if (BOT && status === 'VOTING') return 'voting';
  if (QTUM && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return 'resultSetting';
  if (BOT && status === 'WAITRESULT') return 'finalizing';
  if (((BOT || QTUM) && status === 'WITHDRAW') || (QTUM && status === 'PENDING')) return 'withdrawing';
  throw Error(`Invalid Phase determined by these -> TOKEN: ${token} STATUS: ${status}`);
};

/**
 * Adds computed properties to each oracle used throughout the app
 */
const massageOracles = (oracles) => oracles.map((oracle) => {
  const phase = getPhase(oracle);

  const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
  const pendingTypes = {
    betting: [Bet],
    voting: [ApproveVote, Vote],
    resultSetting: [ApproveSetResult, SetResult],
    finalizing: [FinalizeResult],
  }[phase] || [];
  const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);

  const isUpcoming = phase === 'voting' && oracle.status === OracleStatus.WaitResult;

  const buttonText = {
    betting: messages.placeBet,
    resultSetting: messages.setResult,
    voting: messages.arbitrate,
    finalizing: messages.finalizeResult,
    withdrawing: messages.withdraw,
  }[phase];

  const amount = parseFloat(_.sum(oracle.amounts)).toFixed(2);

  return {
    amountLabel: phase === 'finalizing' ? `${amount} ${oracle.token}` : '',
    url: `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`,
    endTime: phase === 'resultSetting' ? oracle.resultSetEndTime : oracle.endTime,
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
  const pendingTypes = [TransactionType.WithdrawEscrow, TransactionType.Withdraw];
  const isPending = topic.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);

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
export function* getAllEventsHandler() {
  yield takeEvery(actions.GET_ALL_EVENTS, function* getAllEventsRequest(action) {
    try {
      const { filters, orderBy, limit, skip } = action;
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(action.walletAddresses, ({ address }) => {
        voteFilters.push({ voterQAddress: address });
        topicFilters.push({ status: OracleStatus.Withdraw, creatorAddress: address });
      });

      // Filter votes
      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Fetch topics against votes that have the winning result index
      _.each(votes, (vote) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: vote.topicAddress, resultIdx: vote.optionIdx });
      });
      const topicsResult = yield call(queryAllTopics, topicFilters, orderBy, limit, skip);
      const topics = _.map(topicsResult, processTopic);


      const oraclesResult = yield call(queryAllOracles, filters, orderBy, limit, skip);

      // Filter out duplicate topics
      const oracles = _.uniqBy(oraclesResult.map(processTopic), 'txid');

      const { field, direction } = orderBy;
      const events = [...massageOracles(oracles), ...massageTopics(topics)].sort((a, b) => (
        direction === 'ASC' ? a[field] - b[field] : b[field] - a[field]
      ));

      yield put({
        type: actions.GET_ALL_EVENTS_RETURN,
        value: events,
        limit: action.limit,
        skip: action.skip,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
      yield put({
        type: actions.GET_ALL_EVENTS_RETURN,
        value: [],
        limit: action.limit,
        skip: action.skip,
        error: {
          ...error,
          route: `${Routes.graphql.http}/getAllEvents`,
        },
      });
    }
  });
}

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
        error: {
          ...error,
          route: `${Routes.graphql.http}/getTopics`,
        },
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

      // Filter votes
      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Fetch topics against votes that have the winning result index
      _.each(votes, (vote) => {
        topicFilters.push({ status: OracleStatus.Withdraw, address: vote.topicAddress, resultIdx: vote.optionIdx });
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
        error: {
          ...error,
          route: `${Routes.graphql.http}/getActionableTopics`,
        },
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
        error: {
          ...error,
          route: `${Routes.graphql.http}/getOracles`,
        },
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
        error: {
          ...error,
          route: `${Routes.graphql.http}/getTransactions`,
        },
      });
    }
  });
}

// Send allTransactions query for pending txs only
export function* getPendingTransactionsHandler() {
  yield takeEvery(actions.GET_PENDING_TRANSACTIONS, function* getPendingTransactionsRequest() {
    try {
      const filters = [{ status: TransactionStatus.Pending }];
      const result = yield call(queryAllTransactions, filters);
      const txs = _.map(result, processTransaction);

      const pendingTxsObj = {
        count: txs.length,
        CREATEEVENT: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveCreateEvent || tx.type === TransactionType.CreateEvent),
        BET: _.filter(txs, { type: TransactionType.Bet }),
        SETRESULT: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveSetResult || tx.type === TransactionType.SetResult),
        VOTE: _.filter(txs, (tx) =>
          tx.type === TransactionType.ApproveVote || tx.type === TransactionType.Vote),
        FINALIZERESULT: _.filter(txs, { type: TransactionType.FinalizeResult }),
        WITHDRAW: _.filter(txs, (tx) =>
          tx.type === TransactionType.Withdraw || tx.type === TransactionType.WithdrawEscrow),
        TRANSFER: _.filter(txs, { type: TransactionType.Transfer }),
        RESETAPPROVE: _.filter(txs, { type: TransactionType.ResetApprove }),
      };

      yield put({
        type: actions.GET_PENDING_TRANSACTIONS_RETURN,
        value: pendingTxsObj,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
      yield put({
        type: actions.GET_PENDING_TRANSACTIONS_RETURN,
        value: [],
        error: {
          ...error,
          route: `${Routes.graphql.http}/getPendingTransactions`,
        },
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

  if (tx.token && tx.token === Token.Bot) {
    if (tx.type !== TransactionType.ApproveCreateEvent
      && tx.type !== TransactionType.ApproveSetResult
      && tx.type !== TransactionType.ApproveVote) {
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

      // Filter votes
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
      console.log(err); // eslint-disable-line
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

/*
* Filter out unique votes by voter address, topic address, and option index.
* Used to query against Topics that you can win.
*/
function getUniqueVotes(votes) {
  const filtered = [];
  _.each(votes, (vote) => {
    if (!_.find(filtered, {
      voterQAddress: vote.voterQAddress,
      topicAddress: vote.topicAddress,
      optionIdx: vote.optionIdx,
    })) {
      filtered.push(vote);
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
    fork(getAllEventsHandler),
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
