const dashboardActions = {
  GET_TOPICS_REQUEST: 'GET_TOPICS_REQUEST',
  GET_TOPICS_SUCCESS: 'GET_TOPICS_SUCCESS',
  GET_TOPICS_ERROR: 'GET_TOPICS_ERROR',
  getTopics: () => ({
    type: dashboardActions.GET_TOPICS_REQUEST,
  }),
};
export default dashboardActions;
