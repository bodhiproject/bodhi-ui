import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function dashboardReducer(state = initState, action) {
  switch (action.type) {
    case actions.TAB_INDEX_CHANGED: {
      return state.set('tabIndex', action.value);
    }
    case actions.SORT_ORDER_CHANGED: {
      return state.set('sortBy', action.sortBy);
    }
    default: {
      return state;
    }
  }
}
