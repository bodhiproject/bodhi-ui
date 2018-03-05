import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import { Token, OracleStatus } from '../../constants';
import { queryAllTopics, queryAllOracles } from '../../network/graphQuery';

export function* getActionableItemCountHandler() {
  yield takeEvery(actions.GET_ACTIONABLE_ITEM_COUNT, function* getActionableItemCountRequest(action) {
    try {
      const topicFilters = [
        { status: OracleStatus.Withdraw },
      ];
      let result = yield call(queryAllTopics, topicFilters);
      let count = result.length;

      const oracleFilters = [
        { token: Token.Qtum, status: OracleStatus.WaitResult, resultSetterQAddress: action.walletAddress },
        { token: Token.Qtum, status: OracleStatus.OpenResultSet },
      ];
      result = yield call(queryAllOracles, oracleFilters);
      count += result.length;

      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        value: count,
      });
    } catch (err) {
      yield put({
        type: actions.GET_ACTIONABLE_ITEM_COUNT_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* dashboardSaga() {
  yield all([
    fork(getActionableItemCountHandler),
  ]);
}
