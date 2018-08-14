import { all, takeEvery, put, fork } from 'redux-saga/effects';

import actions from './actions';
import axios from '../../network/httpRequest';
import Routes from '../../network/routes';

// Get the total statistics from the Qtum Insight API
export function* getInsightTotalsRequestHandler() {
  yield takeEvery(actions.GET_INSIGHT_TOTALS, function* getInsightTotalsRequest() {
    try {
      const { data } = yield axios.get(Routes.insight.totals);
      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        timeBetweenBlocks: data.time_between_blocks,
      });
    } catch (error) {
      console.error(error.message); // eslint-disable-line
    }
  });
}

// Get transaction cost
export function* getTransactionCostRequestHandler() {
  yield takeEvery(actions.GET_TRANSACTION_COST, function* getTransactionCostRequest(action) {
    try {
      const { data: { result } } = yield axios.post(Routes.api.transactionCost, action.txInfo);
      yield put({
        type: actions.GET_TRANSACTION_COST_RETURN,
        value: result,
      });
    } catch (err) {
      yield put({
        type: actions.GET_TRANSACTION_COST_RETURN,
        error: {
          route: Routes.api.transactionCost,
          message: err.message,
        },
      });
    }
  });
}

export default function* appSaga() {
  yield all([
    fork(getInsightTotalsRequestHandler),
    fork(getTransactionCostRequestHandler),
  ]);
}
