const dashboardActions = {
  SORT_ORDER_CHANGED: 'SORT_ORDER_CHANGED',
  sortOrderChanged: (sortBy) => ({
    type: dashboardActions.SORT_ORDER_CHANGED,
    sortBy,
  }),
};

export default dashboardActions;
