import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function topicReducer(state = initState, action) {
  switch (action.type) {
    case actions.CALCULATE_WINNINGS_RETURN: {
      return state.set('botWinnings', action.value.botWon)
        .set('qtumWinnings', action.value.qtumWon);
    }
    default: {
      return state;
    }
  }
}
