import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../network/httpRequest';
import { createTopic, createBetTx, createApproveTx, createSetResultTx, createVoteTx, createFinalizeResultTx, 
  createWithdrawTx } from '../../network/graphMutation';
import { convertBNHexStrToQtum } from '../../helpers/utility';

import Routes from '../../network/routes';
import Config from '../../config/app';

export function* createRequestHandler() {
  yield takeEvery(actions.CREATE, function* onCreateRequest(action) {
    const {
      centralizedOracle,
      name,
      results,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress,
    } = action.payload;

    try {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          oracleAddress: centralizedOracle,
          eventName: name,
          resultNames: results,
          bettingStartTime,
          bettingEndTime,
          resultSettingStartTime,
          resultSettingEndTime,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.createTopic, requestOptions);

      // Transaction mutation
      const mutation = yield call(createTopic, Config.defaults.version, centralizedOracle, name, results,
        bettingStartTime, bettingEndTime, resultSettingStartTime, resultSettingEndTime, senderAddress);

      yield put({
        type: actions.CREATE_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.CREATE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

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

      const tx = yield call(request, Routes.bet, options);

      // Transaction mutation
      const mutation = yield call(createBetTx, Config.defaults.version, senderAddress, contractAddress, index, amount);

      yield put({
        type: actions.BET_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.BET_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* approveRequestHandler() {
  yield takeEvery(actions.APPROVE, function* onApproveRequest(action) {
    const {
      contractAddress,
      spender,
      value,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          spender,
          value,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.approve, options);

      // Transaction mutation
      const mutation = yield call(createApproveTx, Config.defaults.version, senderAddress, contractAddress, value);

      yield put({
        type: actions.APPROVE_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.APPROVE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* allowanceRequestHandler() {
  yield takeEvery(actions.ALLOWANCE, function* onAllowanceRequest(action) {
    const {
      owner, spender, senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          owner,
          spender,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.allowance, options);

      const value = convertBNHexStrToQtum(result.remaining);

      yield put({
        type: actions.ALLOWANCE_RETURN,
        value,
      });
    } catch (error) {
      yield put({
        type: actions.ALLOWANCE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* setResultRequestHandler() {
  yield takeEvery(actions.SET_RESULT, function* onSetResultRequest(action) {
    const {
      contractAddress,
      resultIndex,
      consensusThreshold,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          resultIndex,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.setResult, options);

      // Transaction mutation
      const mutation = yield call(createSetResultTx, Config.defaults.version, senderAddress, contractAddress,
        consensusThreshold, resultIndex);

      yield put({
        type: actions.SET_RESULT_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.SET_RESULT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* voteRequestHandler() {
  yield takeEvery(actions.VOTE, function* onVoteRequest(action) {
    const {
      contractAddress,
      resultIndex,
      botAmount,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          resultIndex,
          botAmount,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.vote, options);

      // Transaction mutation
      const mutation = yield call(createVoteTx, Config.defaults.version, senderAddress, contractAddress,
        resultIndex, botAmount);

      yield put({
        type: actions.VOTE_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.VOTE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* finalizeResultRequestHandler() {
  yield takeEvery(actions.FINALIZE_RESULT, function* onFinalizeResultRequest(action) {
    const {
      contractAddress,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.finalizeResult, options);

      // Transaction mutation
      const mutation = yield call(createFinalizeResultTx, Config.defaults.version, senderAddress, contractAddress);

      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* calculateWinningsRequestHandler() {
  yield takeEvery(actions.CALCULATE_WINNINGS, function* onCalculateWinningsRequest(action) {
    const {
      contractAddress,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.winnings, options);
      let value;
      if (result) {
        const botWon = convertBNHexStrToQtum(result['0']);
        const qtumWon = convertBNHexStrToQtum(result['1']);
        value = { botWon, qtumWon };
      }

      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value,
      });
    } catch (error) {
      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* withdrawRequestHandler() {
  yield takeEvery(actions.WITHDRAW, function* onWithdrawResultRequest(action) {
    const {
      contractAddress,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const tx = yield call(request, Routes.withdraw, options);

      // Transaction mutation
      const mutation = yield call(createWithdrawTx, Config.defaults.version, senderAddress, contractAddress);

      yield put({
        type: actions.WITHDRAW_RETURN,
        value: { tx },
      });
    } catch (error) {
      yield put({
        type: actions.WITHDRAW_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(createRequestHandler),
    fork(betRequestHandler),
    fork(approveRequestHandler),
    fork(allowanceRequestHandler),
    fork(setResultRequestHandler),
    fork(voteRequestHandler),
    fork(finalizeResultRequestHandler),
    fork(calculateWinningsRequestHandler),
    fork(withdrawRequestHandler),
  ]);
}
