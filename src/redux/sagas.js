import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import stateSagas from './state/saga';
import graphqlSagas from './graphql/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    stateSagas(),
    graphqlSagas(),
  ]);
}
