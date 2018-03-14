import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { request } from '../../network/httpRequest';
import { satoshiToDecimal } from '../../helpers/utility';
import Routes from '../../network/routes';

export function* getBetAndVoteBalancesHandler() {
  yield takeEvery(actions.GET_BET_AND_VOTE_BALANCES, function* getBetAndVoteBalancesRequest(action) {
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
        headers: { 'Content-Type': 'application/json' },
      };

      let result = yield call(request, Routes.betBalances, options);
      const bets = _.map(result[0], satoshiToDecimal);

      result = yield call(request, Routes.voteBalances, options);
      const votes = _.map(result[0], satoshiToDecimal);

      yield put({
        type: actions.GET_BET_VOTE_BALANCES_RETURN,
        value: {
          bets,
          votes,
        },
      });
    } catch (err) {
      yield put({
        type: actions.GET_BET_VOTE_BALANCES_RETURN,
        error: {
          route: `${Routes.betBalances} ${Routes.voteBalances}`,
          message: err.message,
        },
      });
    }
  });
}

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
    fork(getBetAndVoteBalancesHandler),
    fork(calculateWinningsHandler),
  ]);
}
