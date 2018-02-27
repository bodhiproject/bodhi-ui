import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../../network/httpRequest';
import { convertBNHexStrToQtum } from '../../../helpers/utility';

import Routes from '../../../network/routes';
import Config from '../../../config/app';

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

      const result = yield call(request, Routes.approve, options);

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

      const result = yield call(request, Routes.vote, options);

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

      const result = yield call(request, Routes.finalizeResult, options);

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

<<<<<<< HEAD
      const result = yield call(request, Routes.withdraw, options);
=======
      const tx = yield call(request, Routes.withdraw, options);
>>>>>>> Remove mutation calls on existing sagas

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

export default function* topicSaga() {
  yield all([
    fork(approveRequestHandler),
    fork(allowanceRequestHandler),
    fork(voteRequestHandler),
    fork(finalizeResultRequestHandler),
    fork(calculateWinningsRequestHandler),
    fork(withdrawRequestHandler),
  ]);
}
