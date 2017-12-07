import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import { queryAllTopics } from '../../helpers/graphql';

import actions from './actions';

import fakeData from './fakedata';

const isFake = false;

export function* getTopicsRequestHandler(/* actions */) {
  yield takeEvery(actions.GET_TOPICS_REQUEST, function* onGetTopicsRequest() {
    console.log('saga: onGetTopicsRequest');

    if (isFake) {
      yield put({
        type: actions.GET_TOPICS_SUCCESS,
        value: fakeData,
      });
    } else {
      try {
        // Query all topics data using graphQL call
        const result = yield call(queryAllTopics);

        yield put({
          type: actions.GET_TOPICS_SUCCESS,
          value: result,
        });
      } catch (error) {
        yield put({
          type: actions.GET_TOPICS_ERROR,
          value: error.message,
        });
      }
    }
  });
}

export default function* dashboardSaga() {
  yield all([
    fork(getTopicsRequestHandler),
  ]);
}
