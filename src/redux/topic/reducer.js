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
    case actions.CREATE_RESULT:
      return state.set('create_result', action.value);
    case actions.CLEAR_BET_RESULT:
      return state.set('bet_result', undefined);
    case actions.CLEAR_CREATE_RESULT:
      return state.set('create_result', undefined);
    default:
      return state;
  }
}
