const dashboardActions = {
  TAB_VIEW_CHANGED: 'TAB_VIEW_CHANGED',
  tabViewChanged: (value) => ({
    type: dashboardActions.TAB_VIEW_CHANGED,
    value,
  }),

  SORT_ORDER_CHANGED: 'SORT_ORDER_CHANGED',
  sortOrderChanged: (sortBy) => ({
    type: dashboardActions.SORT_ORDER_CHANGED,
    sortBy,
  }),
};
export default dashboardActions;
