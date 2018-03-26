import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import { request } from '../../network/httpRequest';
import { queryAllVotes } from '../../network/graphQuery';
import { satoshiToDecimal, getUniqueVotes } from '../../helpers/utility';
import Routes from '../../network/routes';
import { WithdrawType } from '../../constants';

export function* getEventEscrowAmountHandler() {
  yield takeEvery(actions.GET_EVENT_ESCROW_AMOUNT, function* getEventEscrowAmountRequest(action) {
    try {
      const {
        senderAddress,
      } = action.params;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.api.eventEscrowAmount, options);
      const eventEscrowAmount = satoshiToDecimal(result[0]);

      yield put({
        type: actions.GET_EVENT_ESCROW_AMOUNT_RETURN,
        value: eventEscrowAmount,
      });
    } catch (err) {
      yield put({
        type: actions.GET_EVENT_ESCROW_AMOUNT_RETURN,
        error: {
          route: Routes.api.eventEscrowAmount,
          message: err.message,
        },
      });
    }
  });
}

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

      let result = yield call(request, Routes.api.betBalances, options);
      const bets = _.map(result[0], satoshiToDecimal);

      result = yield call(request, Routes.api.voteBalances, options);
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
          route: `${Routes.api.betBalances} ${Routes.api.voteBalances}`,
          message: err.message,
        },
      });
    }
  });
}

export function* getWithdrawableAddressesHandler() {
  yield takeEvery(actions.GET_WITHDRAWABLE_ADDRESSES, function* getWithdrawableAddressesRequest(action) {
    // Get event escrow amount
    let eventEscrowAmount;
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          senderAddress: action.senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.api.eventEscrowAmount, options);
      eventEscrowAmount = satoshiToDecimal(result[0]);
    } catch (err) {
      yield put({
        type: actions.GET_WITHDRAWABLE_ADDRESSES_RETURN,
        error: {
          route: Routes.api.eventEscrowAmount,
          message: err.message,
        },
      });
    }

    // Get winning addresses
    try {
      const winningAddresses = [];

      // Get all winning votes for a Topic
      const voteFilters = [];
      _.each(action.walletAddresses, (item) => {
        voteFilters.push({
          topicAddress: action.topic.address,
          optionIdx: action.topic.resultIdx,
          voterQAddress: item.address,
        });

        // Add escrow withdraw object if is event creator
        if (item.address === action.topic.creatorAddress) {
          winningAddresses.push({
            type: WithdrawType.escrow,
            address: item.address,
            botWon: eventEscrowAmount,
            qtumWon: 0,
          });
        }
      });

      // Filter unique votes
      let votes = yield call(queryAllVotes, voteFilters);
      votes = getUniqueVotes(votes);

      // Create array of winning addresses and amounts
      for (let i = 0; i < votes.length; i++) {
        const vote = votes[i];
        const options = {
          method: 'POST',
          body: JSON.stringify({
            contractAddress: vote.topicAddress,
            senderAddress: vote.voterQAddress,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const result = yield call(request, Routes.api.winnings, options);
        let botWon = 0;
        let qtumWon = 0;

        if (result) {
          botWon = satoshiToDecimal(result['0']);
          qtumWon = satoshiToDecimal(result['1']);
        }

        // return only winning addresses
        if (botWon || qtumWon) {
          winningAddresses.push({
            type: WithdrawType.winnings,
            address: vote.voterQAddress,
            botWon,
            qtumWon,
          });
        }
      }

      yield put({
        type: actions.GET_WITHDRAWABLE_ADDRESSES_RETURN,
        value: winningAddresses,
      });
    } catch (err) {
      yield put({
        type: actions.GET_WITHDRAWABLE_ADDRESSES_RETURN,
        error: {
          route: '',
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
        walletAddresses,
      } = action.params;

      const value = [];
      for (let i = 0; i < walletAddresses.length; i++) {
        const item = walletAddresses[i];
        const senderAddress = item.address;
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

        const result = yield call(request, Routes.api.winnings, options);
        let botWon = 0;
        let qtumWon = 0;

        if (result) {
          botWon = satoshiToDecimal(result['0']);
          qtumWon = satoshiToDecimal(result['1']);
        }

        // return only winning addresses
        if (botWon || qtumWon) {
          value.push({ address: senderAddress, botWon, qtumWon });
        }
      }

      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        value,
      });
    } catch (err) {
      yield put({
        type: actions.CALCULATE_WINNINGS_RETURN,
        error: {
          route: Routes.api.winnings,
          message: err.message,
        },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(getEventEscrowAmountHandler),
    fork(getBetAndVoteBalancesHandler),
    fork(getWithdrawableAddressesHandler),
    fork(calculateWinningsHandler),
  ]);
}
