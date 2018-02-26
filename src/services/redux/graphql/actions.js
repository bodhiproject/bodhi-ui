const graphqlActions = {
  CREATE_TOPIC: 'CREATE_TOPIC',
  CREATE_TOPIC_RETURN: 'CREATE_TOPIC_RETURN',
  createTopic: (params) => ({
    type: graphqlActions.CREATE_TOPIC,
    params,
  }),
};

export default graphqlActions;
