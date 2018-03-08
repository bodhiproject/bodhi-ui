const dashboardActions = {
  TAB_INDEX_CHANGED: 'TAB_INDEX_CHANGED',
  tabIndexChanged: (value) => ({
    type: dashboardActions.TAB_INDEX_CHANGED,
    value,
  }),

  SORT_ORDER_CHANGED: 'SORT_ORDER_CHANGED',
  sortOrderChanged: (sortBy) => ({
    type: dashboardActions.SORT_ORDER_CHANGED,
    sortBy,
  }),
};

export default dashboardActions;
