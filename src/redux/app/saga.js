import _ from 'lodash';
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { querySyncInfo } from '../../helpers/graphql';
import { request, convertBNHexStrToQtum } from '../../helpers/utility';
import Routes from '../../config/routes';

const DEFAULT_QTUMD_ACCOUNTNAME = '';

export function* listUnspentRequestHandler() {
  yield takeEvery(actions.LIST_UNSPENT, function* listUnspentRequest() {
    try {
      const result = yield call(request, Routes.listUnspent);

      if (_.isEmpty(result)) {
        // If listunspent return is empty meaning one has no balance in his addresses we will get default qtumd account's address
        // This is likely to be the case when bodhi-app is first installed
        const options = {
          method: 'POST',
          body: JSON.stringify({
            accountName: DEFAULT_QTUMD_ACCOUNTNAME,
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        const defaultAddress = yield call(request, Routes.getAccountAddress, options);

        yield put({
          type: actions.LIST_UNSPENT_RESULT,
          value: {
            result: [{
              address: defaultAddress,
              amount: 0,
            }],
          },
        });
      } else {
        // If listunspent returns with a non-empty list
        yield put({
          type: actions.LIST_UNSPENT_RESULT,
          value: { result },
        });
      }
    } catch (error) {
      yield put({
        type: actions.LIST_UNSPENT_RESULT,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* getBlockCountRequestHandler() {
  yield takeEvery(actions.GET_BLOCK_COUNT, function* getBlockCountRequest() {
    try {
      const result = yield call(request, Routes.getBlockCount);

      yield put({
        type: actions.GET_BLOCK_COUNT_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BLOCK_COUNT_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* getBotBalanceRequestHandler() {
  yield takeEvery(actions.GET_BOT_BALANCE, function* getBotBalanceRequest(action) {
    try {
      const {
        owner,
        senderAddress,
      } = action.payload;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          owner,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.botBalance, options);
      const botValue = result && result.balance ? convertBNHexStrToQtum(result.balance) : 0; // Convert BN hex string from request to BOT number

      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: {
          address: owner,
          value: botValue,
        },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export function* getSyncInfoRequestHandler() {
  yield takeEvery(actions.GET_SYNC_INFO, function* getSyncInfoRequest(action) {
    try {
      // Query all topics data using graphQL call
      const result = yield call(querySyncInfo);

      yield put({
        type: actions.GET_SYNC_INFO_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_SYNC_INFO_RETURN,
        value: error.message,
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(listUnspentRequestHandler),
    fork(getBlockCountRequestHandler),
    fork(getBotBalanceRequestHandler),
    fork(getSyncInfoRequestHandler),
  ]);
}
