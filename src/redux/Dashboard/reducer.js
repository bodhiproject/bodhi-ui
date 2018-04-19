import { Map } from 'immutable';
import actions from './actions';
import { SortBy } from '../../constants';

const initState = {
  value: undefined,
  sortBy: SortBy.Ascending,
};

export default function dashboardReducer(state = initState, action) {
  switch (action.type) {
    case actions.TAB_INDEX_CHANGED:
      return {
        ...state,
        tabIndex: action.value,
      };
    case actions.SORT_ORDER_CHANGED:
      return {
        ...state,
        sortBy: action.sortBy,
      };
    default:
      return state;
  }
}
