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

      yield put({
        type: actions.BET_RETURN,
        value: { result },
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
      spender, value, senderAddress,
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

      const result = yield call(request, 'http://localhost:8080/approve', options);

      yield put({
        type: actions.APPROVE_RETURN,
        value: { result },
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

      const result = yield call(request, 'http://localhost:8080/allowance', options);

      yield put({
        type: actions.ALLOWANCE_RETURN,
        value: { result },
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
      contractAddress, resultIndex, senderAddress,
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

      const result = yield call(request, 'http://localhost:8080/setresult', options);

      yield put({
        type: actions.SET_RESULT_RETURN,
        value: { result },
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

      const result = yield call(request, 'http://localhost:8080/vote', options);

      yield put({
        type: actions.VOTE_RETURN,
        value: { result },
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
      contractAddress, senderAddress,
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

      const result = yield call(request, 'http://localhost:8080/finalizeresult', options);

      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.FINALIZE_RESULT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* calculateQtumWinningsRequestHandler() {
  yield takeEvery(actions.CALCULATE_QTUM_WINNINGS, function* onCalculateQtumWinningsRequest(action) {
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

      const result = yield call(request, 'http://localhost:8080/qtumwinnings', options);

      yield put({
        type: actions.CALCULATE_QTUM_WINNINGS_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.CALCULATE_QTUM_WINNINGS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* calculateBotWinningsRequestHandler() {
  yield takeEvery(actions.CALCULATE_BOT_WINNINGS, function* onCalculateBotWinningsRequest(action) {
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

      const result = yield call(request, 'http://localhost:8080/botwinnings', options);

      yield put({
        type: actions.CALCULATE_BOT_WINNINGS_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.CALCULATE_BOT_WINNINGS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* withdrawRequestHandler() {
  yield takeEvery(actions.WITHDRAW, function* onWithdrawResultRequest(action) {
    const {
      contractAddress, senderAddress,
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

      const result = yield call(request, 'http://localhost:8080/withdraw', options);

      yield put({
        type: actions.WITHDRAW_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.WITHDRAW_RETURN,
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
      senderAddress,
    } = action.payload;

    try {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          oracleAddress: resultSetterAddress,
          eventName: name,
          resultNames: options,
          bettingEndBlock,
          resultSettingEndBlock,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, 'http://localhost:8080/createtopic', requestOptions);

      yield put({
        type: actions.CREATE_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.CREATE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(betRequestHandler),
    fork(createRequestHandler),
    fork(approveRequestHandler),
    fork(allowanceRequestHandler),
    fork(setResultRequestHandler),
    fork(voteRequestHandler),
    fork(finalizeResultRequestHandler),
    fork(withdrawRequestHandler),
  ]);
}
