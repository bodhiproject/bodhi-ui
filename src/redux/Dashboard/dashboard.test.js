import { createStore } from '../store';
import { SortBy } from '../../constants';

describe('Dashboard tests', () => {
  const store = createStore();
  // const dashboard = store.getState();
  it('should have the sortBy start out as ASC', () => {
    // console.log('STORE: ', store);
    store.dispatch({
      type: 'SORT_ORDER_CHANGED',
      sortBy: SortBy.Descending,
    });
    expect(store.getState().dashboard.sortBy).toBe(SortBy.Descending);
  });
});
