import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import graphqlSagas from './graphql/saga';
import topicSagas from './Topic/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    graphqlSagas(),
    topicSagas(),
  ]);
}
