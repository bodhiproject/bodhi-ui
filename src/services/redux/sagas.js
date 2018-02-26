import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import dashboardSagas from './dashboard/saga';
import topicSagas from './topic/saga';
import graphqlSagas from './graphql/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    dashboardSagas(),
    topicSagas(),
    graphqlSagas(),
  ]);
}
