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

    /* Bet return */
    case actions.BET_RETURN:
      return state.set('req_return', action.value);

    /* Create return */
    case actions.CREATE_RETURN:
      return state.set('create_return', action.value);
    case actions.CLEAR_CREATE_RETURN:
      return state.set('create_return', undefined);

    /* Approve return, not captured by view files at this moment */
    case actions.APPROVE_RETURN:
      return state.set('approve_return', action.value);

    /* Allowance return */
    case actions.ALLOWANCE_RETURN:
      return state.set('allowance_return', action.value);

    /* Set result return */
    case actions.SET_RESULT_RETURN:
      return state.set('req_return', action.value);

    /* Vote return */
    case actions.VOTE_RETURN:
      return state.set('req_return', action.value);

    /* Finalize result return, not captured by view files at this moment */
    case actions.FINALIZE_RESULT_RETURN:
      return state.set('req_return', action.value);
    case actions.CLEAR_FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', undefined);

    /* Calculate winnings return */
    case actions.CALCULATE_WINNINGS_RETURN:
      return state.set('calculate_bot_winnings_return', action.value.botWon)
        .set('calculate_qtum_winnings_return', action.value.qtumWon);

    /* Withdraw result return */
    case actions.WITHDRAW_RETURN:
      return state.set('req_return', action.value);

    /* Clear request return on the page */
    case actions.CLEAR_REQ_RETURN:
      return state.set('req_return', undefined);

    /* Clear allowance return on Oracle page */
    case actions.CLEAR_ALLOWANCE_RETURN:
      return state.set('allowance_return', undefined);

    default:
      return state;
  }
}
