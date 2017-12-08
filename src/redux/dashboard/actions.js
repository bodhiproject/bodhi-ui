const dashboardActions = {
  GET_TOPICS_REQUEST: 'GET_TOPICS_REQUEST',
  GET_TOPICS_SUCCESS: 'GET_TOPICS_SUCCESS',
  GET_TOPICS_ERROR: 'GET_TOPICS_ERROR',
  getTopics: () => ({
    type: dashboardActions.GET_TOPICS_REQUEST,
  }),
  GET_ORACLES_REQUEST: 'GET_ORACLES_REQUEST',
  GET_ORACLES_SUCCESS: 'GET_ORACLES_SUCCESS',
  GET_ORACLES_ERROR: 'GET_ORACLES_ERROR',
  getOracles: () => ({
    type: dashboardActions.GET_ORACLES_REQUEST,
  }),
};
export default dashboardActions;
