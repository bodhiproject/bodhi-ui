const dashboardActions = {
  GET_ACTIONABLE_ITEM_COUNT: 'GET_ACTIONABLE_ITEM_COUNT',
  GET_ACTIONABLE_ITEM_COUNT_RETURN: 'GET_ACTIONABLE_ITEM_COUNT_RETURN',
  getActionableItemCount: (walletAddress) => ({
    type: dashboardActions.GET_ACTIONABLE_ITEM_COUNT,
    walletAddress,
  }),

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
