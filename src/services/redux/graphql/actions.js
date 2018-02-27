const graphqlActions = {
  CREATE_TOPIC_TX: 'CREATE_TOPIC_TX',
  CREATE_TOPIC_TX_RETURN: 'CREATE_TOPIC_TX_RETURN',
  createTopicTx: (
    name,
    results,
    centralizedOracle,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    senderAddress,
  ) => ({
    type: graphqlActions.CREATE_TOPIC_TX,
    params: {
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress,
    },
  }),

  CREATE_BET_TX: 'CREATE_BET_TX',
  CREATE_BET_TX_RETURN: 'CREATE_BET_TX_RETURN',
  createBetTx: (contractAddress, index, amount, senderAddress) => ({
    type: graphqlActions.CREATE_BET_TX,
    params: {
      contractAddress,
      index,
      amount,
      senderAddress,
    },
  }),

  CREATE_SET_RESULT_TX: 'CREATE_SET_RESULT_TX',
  CREATE_SET_RESULT_TX_RETURN: 'CREATE_SET_RESULT_TX_RETURN',
  createSetResultTx: (topicAddress, oracleAddress, index, consensusThreshold, senderAddress) => ({
    type: graphqlActions.CREATE_SET_RESULT_TX,
    params: {
      topicAddress,
      oracleAddress,
      index,
      consensusThreshold,
      senderAddress,
    },
  }),

  CREATE_VOTE_TX: 'CREATE_VOTE_TX',
  CREATE_VOTE_TX_RETURN: 'CREATE_VOTE_TX_RETURN',
  createVoteTx: (topicAddress, oracleAddress, resultIndex, botAmount, senderAddress) => ({
    type: graphqlActions.CREATE_VOTE_TX,
    params: {
      topicAddress,
      oracleAddress,
      resultIndex,
      botAmount,
      senderAddress,
    },
  }),

  CREATE_FINALIZE_RESULT_TX: 'CREATE_FINALIZE_RESULT_TX',
  CREATE_FINALIZE_RESULT_TX_RETURN: 'CREATE_FINALIZE_RESULT_TX_RETURN',
  createFinalizeResultTx: (oracleAddress, senderAddress) => ({
    type: graphqlActions.CREATE_FINALIZE_RESULT_TX,
    params: {
      oracleAddress,
      senderAddress,
    },
  }),

  CREATE_WITHDRAW_TX: 'CREATE_WITHDRAW_TX',
  CREATE_WITHDRAW_TX_RETURN: 'CREATE_WITHDRAW_TX_RETURN',
  createWithdrawTx: (topicAddress, senderAddress) => ({
    type: graphqlActions.CREATE_WITHDRAW_TX,
    params: {
      topicAddress,
      senderAddress,
    },
  }),
};

export default graphqlActions;
