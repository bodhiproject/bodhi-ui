import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import dashboardSagas from './dashboard/saga';
import topicSagas from './topic/saga';
export default function* rootSaga() {
  yield all([
    appSagas(),
    dashboardSagas(),
    topicSagas()]);
}
