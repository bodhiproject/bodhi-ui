const graphqlActions = {
  CREATE_TOPIC: 'CREATE_TOPIC',
  CREATE_TOPIC_RETURN: 'CREATE_TOPIC_RETURN',
  createTopic: (centralizedOracle, name, results, bettingStartTime, bettingEndTime, resultSettingStartTime,
    resultSettingEndTime, senderAddress) => ({
    type: graphqlActions.CREATE_TOPIC,
    centralizedOracle,
    name,
    results,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    senderAddress,
  }),
};

export default graphqlActions;
