import { all, takeEvery, put, fork, call } from 'redux-saga/effects';

import actions from './actions';
import { createTopic } from '../../../network/graphMutation';
import Config from '../../../config/app';

export function* createTopicRequestHandler() {
  yield takeEvery(actions.CREATE_TOPIC, function* createTopicRequest(action) {
    try {
      const tx = yield call(
        createTopic,
        Config.defaults.version,
        action.centralizedOracle,
        action.name,
        action.results,
        action.bettingStartTime,
        action.bettingEndTime,
        action.resultSettingStartTime,
        action.resultSettingEndTime,
        action.senderAddress
      );

      yield put({
        type: actions.CREATE_TOPIC_RETURN,
        result: tx,
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_TOPIC_RETURN,
        error: err.message,
      });
    }
  });
}

export default function* graphqlSaga() {
  yield all([
    fork(createTopicRequestHandler),
  ]);
}
