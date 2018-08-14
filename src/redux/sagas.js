import { all } from 'redux-saga/effects';
import graphqlSagas from './Graphql/saga';
import topicSagas from './Topic/saga';

export default function* rootSaga() {
  yield all([
    graphqlSagas(),
    topicSagas(),
  ]);
}
