import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import dashboardSagas from './dashboard/saga';
import stateSagas from './state/saga';
import graphqlSagas from './graphql/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    dashboardSagas(),
    stateSagas(),
    graphqlSagas(),
  ]);
}
