/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["topic","oracle"] }] */
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import { queryAllTopics, queryAllOracles } from '../../network/graphRequest';
import { convertBNHexStrToQtum } from '../../helpers/utility';
import actions from './actions';
import fakeData from './fakedata';

/** @type {Boolean} [ Use ./fakedata if true; othwerwise read from DB. ] */
const isFake = false;

export function* getTopicsRequestHandler(/* actions */) {
  yield takeEvery(actions.GET_TOPICS_REQUEST, function* onGetTopicsRequest(action) {
    if (isFake) {
      yield put({
        type: actions.GET_TOPICS_SUCCESS,
        value: fakeData,
      });
    } else {
      try {
        // Query all topics data using graphQL call
        const result = yield call(queryAllTopics, action.filters, action.orderBy);
        const topics = _.map(result, processTopic);

        yield put({
          type: actions.GET_TOPICS_SUCCESS,
          value: topics,
        });
      } catch (error) {
        yield put({
          type: actions.GET_TOPICS_ERROR,
          value: error.message,
        });
      }
    }
  });
}

export function* getOraclesRequestHandler(/* actions */) {
  yield takeEvery(actions.GET_ORACLES_REQUEST, function* onGetOraclesRequest(action) {
    try {
      // Query all topics data using graphQL call
      const result = yield call(queryAllOracles, action.filters, action.orderBy);
      const oracles = result.map(processOracle);

      yield put({
        type: actions.GET_ORACLES_SUCCESS,
        value: oracles,
      });
    } catch (error) {
      yield put({
        type: actions.GET_ORACLES_ERROR,
        value: error.message,
      });
    }
  });
}

/**
 * Return a new Topic object with processed fields for UI
 * @param  {[type]}
 * @return {[type]}
 */
function processTopic(topic) {
  if (!topic) {
    return undefined;
  }

  const newObj = _.assign({}, topic);

  newObj.qtumAmount = _.map(topic.qtumAmount, convertBNHexStrToQtum);
  newObj.botAmount = _.map(topic.botAmount, convertBNHexStrToQtum);
  newObj.oracles = _.map(topic.oracles, processOracle);

  return newObj;
}

/**
 * Return a new Oracle object with processed fields for UI
 * @param  {[type]}
 * @return {[type]}
 */
function processOracle(oracle) {
  if (!oracle) {
    return undefined;
  }

  const newObj = _.assign({}, oracle);

  // Convert numbers in amounts from BN to int
  newObj.amounts = _.map(oracle.amounts, convertBNHexStrToQtum);
  newObj.consensusThreshold = convertBNHexStrToQtum(oracle.consensusThreshold);

  return newObj;
}

export default function* dashboardSaga() {
  yield all([
    fork(getTopicsRequestHandler),
    fork(getOraclesRequestHandler),
  ]);
}
