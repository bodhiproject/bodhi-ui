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

      /* Bet return */

    case actions.BET_RETURN:
      return state.set('req_return', action.value);

      /* Create return */

    case actions.CREATE_RETURN:
      return state.set('create_return', action.value);
    case actions.CLEAR_CREATE_RETURN:
      return state.set('create_return', undefined);

      /* Set result return */

    case actions.SET_RESULT_RETURN:
      return state.set('req_return', action.value);
    // case actions.CLEAR_SET_RESULT_RETURN:
    //   return state.set('request_return', undefined);

      /* Vote return */

    case actions.VOTE_RETURN:
      return state.set('req_return', action.value);

      /* finalize result return */

    case actions.FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', action.value);
    case actions.CLEAR_FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', undefined);


      /* Withdraw result return */

    case actions.WITHDRAW_RETURN:
      return state.set('withdraw_return', action.value);

    /* Clear request return on the page */
    case actions.CLEAR_REQ_RETURN:
      return state.set('req_return', undefined);

    default:
      return state;
  }
}
