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
        action.params.centralizedOracle,
        action.params.name,
        action.params.results,
        action.params.bettingStartTime,
        action.params.bettingEndTime,
        action.params.resultSettingStartTime,
        action.params.resultSettingEndTime,
        action.params.senderAddress
      );

      yield put({
        type: actions.CREATE_TOPIC_RETURN,
        value: tx,
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
