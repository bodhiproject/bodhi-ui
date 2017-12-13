import { all } from 'redux-saga/effects';
import dashboardSagas from './dashboard/saga';
import topicSagas from './topic/saga';
export default function* rootSaga() {
  yield all([
    dashboardSagas(),
    topicSagas(),
  ]);
}
