import { createStore } from '../store';
import { SortBy } from '../../constants';
import dashboardActions from './actions';

describe('Dashboard tests', () => {
  const store = createStore();
  it('should have the sortBy start out as ASC', () => {
    expect(store.getState().dashboard.sortBy).toBe(SortBy.Ascending);
  });
  it('should change the sortBy to DESC when switching direction', () => {
    store.dispatch(dashboardActions.sortOrderChanged(SortBy.Descending));
    expect(store.getState().dashboard.sortBy).toBe(SortBy.Descending);
  });
});
