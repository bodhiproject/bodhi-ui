import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import _ from 'lodash';

import actions from './actions';
import axios from '../../network/httpRequest';
import { queryAllTopics, queryAllVotes } from '../../network/graphQuery';
import { satoshiToDecimal, processTopic } from '../../helpers/utility';
import Routes from '../../network/routes';
import { TransactionType } from '../../constants';

export function* getEventEscrowAmountHandler() {
  yield takeEvery(actions.GET_EVENT_ESCROW_AMOUNT, function* getEventEscrowAmountRequest(action) {
    try {
      const { senderAddress } = action.params;

      const { data: { result } } = yield axios.post(Routes.api.eventEscrowAmount, {
        senderAddress,
      });
      const eventEscrowAmount = satoshiToDecimal(result[0]);

      yield put({
        type: actions.GET_EVENT_ESCROW_AMOUNT_RETURN,
        eventEscrowAmount,
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
      const { contractAddress, walletAddresses } = action;

      // Get all votes for this Topic
      const voteFilters = [];
      _.each(walletAddresses, (item) => {
        voteFilters.push({
          topicAddress: contractAddress,
          voterQAddress: item.address,
        });
      });

      // Filter unique votes
      const allVotes = yield call(queryAllVotes, voteFilters);
      const uniqueVotes = [];
      _.each(allVotes, (vote) => {
        const { voterQAddress, topicAddress } = vote;
        if (!_.find(uniqueVotes, { voterQAddress, topicAddress })) {
          uniqueVotes.push(vote);
        }
      });

      // Call bet and vote balances for each unique vote address and get arrays for each address
      const betArrays = [];
      const voteArrays = [];
      for (let i = 0; i < uniqueVotes.length; i++) {
        const voteObj = uniqueVotes[i];

        const betBalances = yield axios.post(Routes.api.betBalances, {
          contractAddress,
          senderAddress: voteObj.voterQAddress,
        });
        betArrays.push(_.map(betBalances.data.result[0], satoshiToDecimal));

        const voteBalances = yield axios.post(Routes.api.voteBalances, {
          contractAddress,
          senderAddress: voteObj.voterQAddress,
        });
        voteArrays.push(_.map(voteBalances.data.result[0], satoshiToDecimal));
      }

      // Sum all arrays by index into one array
      const bets = _.map(_.unzip(betArrays), _.sum);
      const votes = _.map(_.unzip(voteArrays), _.sum);

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
    try {
      const { eventAddress, walletAddresses } = action;
      const withdrawableAddresses = [];

      // Fetch Topic
      const topics = yield call(queryAllTopics, [{ address: eventAddress }]);
      let topic;
      if (!_.isEmpty(topics)) {
        topic = processTopic(topics[0]);
      } else {
        throw new Error(`Unable to find topic ${eventAddress}`);
      }

      // Get all winning votes for this Topic
      const voteFilters = [];
      let escrowClaim = 0;
      _.each(walletAddresses, (item) => {
        voteFilters.push({
          topicAddress: topic.address,
          optionIdx: topic.resultIdx,
          voterQAddress: item.address,
        });

        // Add escrow withdraw object if is event creator
        if (item.address === topic.creatorAddress) {
          withdrawableAddresses.push({
            type: TransactionType.WithdrawEscrow,
            address: item.address,
            botWon: topic.escrowAmount,
            qtumWon: 0,
          });
          escrowClaim = topic.escrowAmount;
        }
      });

      // Filter unique votes
      const votes = yield call(queryAllVotes, voteFilters);
      const filtered = [];
      _.each(votes, (vote) => {
        if (!_.find(filtered, {
          voterQAddress: vote.voterQAddress,
          topicAddress: vote.topicAddress,
        })) {
          filtered.push(vote);
        }
      });

      // Calculate winnings for each winning vote
      for (let i = 0; i < filtered.length; i++) {
        const vote = filtered[i];

        const { data: { result } } = yield axios.post(Routes.api.winnings, {
          contractAddress: topic.address,
          senderAddress: vote.voterQAddress,
        });
        const botWon = result ? satoshiToDecimal(result['0']) : 0;
        const qtumWon = result ? satoshiToDecimal(result['1']) : 0;

        // return only winning addresses
        if (botWon || qtumWon) {
          withdrawableAddresses.push({
            type: TransactionType.Withdraw,
            address: vote.voterQAddress,
            botWon,
            qtumWon,
          });
        }
      }

      yield put({
        type: actions.GET_WITHDRAWABLE_ADDRESSES_RETURN,
        value: withdrawableAddresses,
        escrowClaim,
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

export default function* topicSaga() {
  yield all([
    fork(getEventEscrowAmountHandler),
    fork(getBetAndVoteBalancesHandler),
    fork(getWithdrawableAddressesHandler),
  ]);
}
