import actions from './actions';
import { SortBy } from '../../constants';

const initState = {
  sortBy: SortBy.Ascending,
};

export default function dashboardReducer(state = initState, action) {
  switch (action.type) {
    case actions.SORT_ORDER_CHANGED:
      return {
        ...state,
        sortBy: action.sortBy,
      };
    default:
      return state;
  }
}
