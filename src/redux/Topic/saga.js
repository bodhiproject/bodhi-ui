import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../network/httpRequest';
import { satoshiToDecimal } from '../../helpers/utility';
import Routes from '../../network/routes';

export function* calculateWinningsHandler() {
  yield takeEvery(actions.CALCULATE_WINNINGS, function* calculateWinningsRequest(action) {
    try {
      const {
        contractAddress,
        senderAddress,
      } = action.params;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const result = yield call(request, Routes.winnings, options);
      let value;
      if (result) {
        const botWon = satoshiToDecimal(result['0']);
        const qtumWon = satoshiToDecimal(result['1']);
        value = { botWon, qtumWon };
      } else {
        value = { botWon: 0, qtumWon: 0 };
      }

      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value,
      });
    } catch (err) {
      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value: { botWon: 0, qtumWon: 0 },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(calculateWinningsHandler),
  ]);
}
