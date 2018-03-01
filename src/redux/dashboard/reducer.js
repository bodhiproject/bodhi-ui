import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  type: 'get_topics',
  success: true,
  value: undefined,
});

export default function authReducer(
  state = initState,
  action
) {
  switch (action.type) {
    case actions.TAB_VIEW_CHANGED:
      return state.set('tabIndex', action.value);
    case actions.SORT_ORDER_CHANGED:
      return state.set('sortBy', action.sortBy);
    default:
      return state;
  }
}
