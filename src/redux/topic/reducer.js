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
    case actions.BET_RESULT:
      return state.set('bet_result', action.value);
    case actions.SET_RESULT_RESULT:
      return state.set('set_result_result', action.value);
    case actions.FINALIZE_RESULT_RETURN:
      return state.set('finalize_result_return', action.value);
    default:
      return state;
  }
}
