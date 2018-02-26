const graphqlActions = {
  CREATE_TOPIC: 'CREATE_TOPIC',
  CREATE_TOPIC_RETURN: 'CREATE_TOPIC_RETURN',
  createTopic: (params) => ({
    type: graphqlActions.CREATE_TOPIC,
    params,
  }),

  CREATE_BET: 'CREATE_BET',
  CREATE_BET_RETURN: 'CREATE_BET_RETURN',
  createBet: (contractAddress, index, amount, senderAddress) => ({
    type: graphqlActions.CREATE_BET,
    params: {
      contractAddress,
      index,
      amount,
      senderAddress,
    },
  }),
};

export default graphqlActions;
