import { all } from 'redux-saga/effects';
import appSagas from './App/saga';
import graphqlSagas from './Graphql/saga';
import topicSagas from './Topic/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    graphqlSagas(),
    topicSagas(),
  ]);
}
