import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  betBalances: [],
  voteBalances: [],
  botWinnings: 0,
  qtumWinnings: 0,
});

export default function topicReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_BET_VOTE_BALANCES_RETURN: {
      if (action.error) {
        return state.set('errorTopic', action.error);
      }
      return state
        .set('betBalances', action.value.bets)
        .set('voteBalances', action.value.votes);
    }
    case actions.CALCULATE_WINNINGS_RETURN: {
      return state
        .set('botWinnings', action.value.botWon)
        .set('qtumWinnings', action.value.qtumWon);
    }
    case actions.CLEAR_ERROR_TOPIC: {
      return state.set('errorTopic', undefined);
    }
    default: {
      return state;
    }
  }
}
