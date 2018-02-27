import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  type: 'toggled',
  value: false,
});

export default function topicReducer(
  state = initState,
  action
) {
  switch (action.type) {
    case actions.EDITING_TOGGLED:
      return state.set('toggled', true);

    /* Clear editing toggled on oracle.js and topic.js */
    case actions.CLEAR_EDITING_TOGGLED:
      return state.set('toggled', false);

    /* Calculate winnings return */
    case actions.CALCULATE_WINNINGS_RETURN:
      return state.set('calculate_bot_winnings_return', action.value.botWon)
        .set('calculate_qtum_winnings_return', action.value.qtumWon);

    /* Clear request return on the page */
    case actions.CLEAR_REQ_RETURN:
      return state.set('req_return', undefined);

    default:
      return state;
  }
}
