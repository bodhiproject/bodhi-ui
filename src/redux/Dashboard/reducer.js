import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function dashboardReducer(state = initState, action) {
  // Catch all request errors
  if (action.error) {
    return state.set('requestError', { msg: action.error });
  }

  switch (action.type) {
    case actions.GET_ACTIONABLE_ITEM_COUNT_RETURN: {
      return state.set('actionableItemCount', action.value);
    }
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
