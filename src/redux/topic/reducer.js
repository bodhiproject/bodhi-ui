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
      return state.set('bet_return', action.value);
    case actions.CLEAR_BET_RESULT:
      return state.set('bet_return', undefined);

      /* Create return */

    case actions.CREATE_RETURN:
      return state.set('create_return', action.value);
    case actions.CLEAR_CREATE_RETURN:
      return state.set('create_return', undefined);

      /* Set result return */

    case actions.SET_RESULT_RETURN:
      return state.set('set_result_return', action.value);
    case actions.CLEAR_SET_RESULT_RETURN:
      return state.set('set_result_return', undefined);

      /* finalize result return */

    case actions.FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', action.value);
    case actions.CLEAR_FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', undefined);

    default:
      return state;
  }
}
