import { all, takeEvery, put, fork /* call */ } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import actions from './actions';

import fakeData from './fakedata';

// const isFake = true;

export function* getTopicsRequestHandler(/* actions */) {
  yield takeEvery(actions.GET_TOPICS_REQUEST, function* onGetTopicsRequest() {
    console.log('saga: onGetTopicsRequest');

    // if (isFake) {
    yield put({
      type: actions.GET_TOPICS_SUCCESS,
      value: fakeData,
    });
    // } else {
    //   try {
    //     // const result = yield call(getList);
    //     const result = undefined;

    //     yield put({
    //       type: actions.GET_TOPICS_SUCCESS,
    //       value: result,
    //     });
    //   } catch (error) {
    //     yield put({
    //       type: actions.GET_TOPICS_ERROR,
    //       value: error.message,
    //     });
    //   }
    // }
  });
}


// export function* getTopicsSuccess() {
//   yield takeEvery(actions.GET_TOPICS_SUCCESS, function* (payload) {
//     console.log(payload);
//   });
// }

// export function* getTopicsError() {
//   yield takeEvery(actions.GET_TOPICS_ERROR, function* (payload) {
//     console.log(payload);
//   });
// }

export default function* dashboardSaga() {
  yield all([
    fork(getTopicsRequestHandler),
    // fork(getTopicsSuccess),
    // fork(getTopicsError),
  ]);
}
