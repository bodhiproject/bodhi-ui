import { Map } from 'immutable';
import _ from 'lodash';
import actions from './actions';

const initState = new Map({
  betBalances: [],
  voteBalances: [],
});

export default function topicReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_EVENT_ESCROW_AMOUNT_RETURN: {
      if (action.error) {
        return state.set('errorTopic', action.error);
      }
      return state.set('eventEscrowAmount', action.value);
    }
    case actions.GET_BET_VOTE_BALANCES_RETURN: {
      if (action.error) {
        return state.set('errorTopic', action.error);
      }
      return state
        .set('betBalances', action.value.bets)
        .set('voteBalances', action.value.votes);
    }
    case actions.GET_WITHDRAWABLE_ADDRESSES_RETURN: {
      if (action.error) {
        return state.set('errorTopic', action.error);
      }
      return state
        .set('withdrawableAddresses', action.value)
        .set('botWinnings', _.sumBy(action.value, (item) => item.botWon ? item.botWon : 0))
        .set('qtumWinnings', _.sumBy(action.value, (item) => item.qtumWon ? item.qtumWon : 0));
    }
    case actions.CLEAR_ERROR_TOPIC: {
      return state.set('errorTopic', undefined);
    }
    default: {
      return state;
    }
  }
}
