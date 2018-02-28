import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';

import { request } from '../../network/httpRequest';
import { convertBNHexStrToQtum } from '../../helpers/utility';
import Routes from '../../network/routes';
import Config from '../../config/app';

export function* calculateWinningsRequestHandler() {
  yield takeEvery(actions.CALCULATE_WINNINGS, function* onCalculateWinningsRequest(action) {
    const {
      contractAddress,
      senderAddress,
    } = action.payload;

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          contractAddress,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.winnings, options);
      let value;
      if (result) {
        const botWon = convertBNHexStrToQtum(result['0']);
        const qtumWon = convertBNHexStrToQtum(result['1']);
        value = { botWon, qtumWon };
      }

      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value,
      });
    } catch (error) {
      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* stateSaga() {
  yield all([
    fork(calculateWinningsRequestHandler),
  ]);
}
