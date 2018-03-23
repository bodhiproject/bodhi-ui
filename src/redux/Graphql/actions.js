const graphqlActions = {
  GET_TOPICS: 'GET_TOPICS',
  GET_TOPICS_RETURN: 'GET_TOPICS_RETURN',
  getTopics: (filters, orderBy, limit, skip) => ({
    type: graphqlActions.GET_TOPICS,
    filters,
    orderBy,
    limit,
    skip,
  }),

  GET_ORACLES: 'GET_ORACLES',
  GET_ORACLES_RETURN: 'GET_ORACLES_RETURN',
  getOracles: (filters, orderBy, limit, skip) => ({
    type: graphqlActions.GET_ORACLES,
    filters,
    orderBy,
    limit,
    skip,
  }),

  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_TRANSACTIONS_RETURN: 'GET_TRANSACTIONS_RETURN',
  getTransactions: (filters, orderBy) => ({
    type: graphqlActions.GET_TRANSACTIONS,
    filters,
    orderBy,
  }),

  GET_PENDING_TRANSACTIONS: 'GET_PENDING_TRANSACTIONS',
  GET_PENDING_TRANSACTIONS_RETURN: 'GET_PENDING_TRANSACTIONS_RETURN',
  getPendingTransactions: () => ({
    type: graphqlActions.GET_PENDING_TRANSACTIONS,
  }),

  GET_ACTIONABLE_ITEM_COUNT: 'GET_ACTIONABLE_ITEM_COUNT',
  GET_ACTIONABLE_ITEM_COUNT_RETURN: 'GET_ACTIONABLE_ITEM_COUNT_RETURN',
  getActionableItemCount: (walletAddress) => ({
    type: graphqlActions.GET_ACTIONABLE_ITEM_COUNT,
    walletAddress,
  }),

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
  createBetTx: (version, topicAddress, oracleAddress, index, amount, senderAddress) => ({
    type: graphqlActions.CREATE_BET_TX,
    params: {
      version,
      topicAddress,
      oracleAddress,
      index,
      amount,
      senderAddress,
    },
  }),

  CREATE_SET_RESULT_TX: 'CREATE_SET_RESULT_TX',
  CREATE_SET_RESULT_TX_RETURN: 'CREATE_SET_RESULT_TX_RETURN',
  createSetResultTx: (version, topicAddress, oracleAddress, index, consensusThreshold, senderAddress) => ({
    type: graphqlActions.CREATE_SET_RESULT_TX,
    params: {
      version,
      topicAddress,
      oracleAddress,
      index,
      consensusThreshold,
      senderAddress,
    },
  }),

  CREATE_VOTE_TX: 'CREATE_VOTE_TX',
  CREATE_VOTE_TX_RETURN: 'CREATE_VOTE_TX_RETURN',
  createVoteTx: (version, topicAddress, oracleAddress, resultIndex, botAmount, senderAddress) => ({
    type: graphqlActions.CREATE_VOTE_TX,
    params: {
      version,
      topicAddress,
      oracleAddress,
      resultIndex,
      botAmount,
      senderAddress,
    },
  }),

  CREATE_FINALIZE_RESULT_TX: 'CREATE_FINALIZE_RESULT_TX',
  CREATE_FINALIZE_RESULT_TX_RETURN: 'CREATE_FINALIZE_RESULT_TX_RETURN',
  createFinalizeResultTx: (version, topicAddress, oracleAddress, senderAddress) => ({
    type: graphqlActions.CREATE_FINALIZE_RESULT_TX,
    params: {
      version,
      topicAddress,
      oracleAddress,
      senderAddress,
    },
  }),

  CREATE_WITHDRAW_TX: 'CREATE_WITHDRAW_TX',
  CREATE_WITHDRAW_TX_RETURN: 'CREATE_WITHDRAW_TX_RETURN',
  createWithdrawTx: (version, topicAddress, senderAddress) => ({
    type: graphqlActions.CREATE_WITHDRAW_TX,
    params: {
      version,
      topicAddress,
      senderAddress,
    },
  }),

  CREATE_TRANSFER_TX: 'CREATE_TRANSFER_TX',
  CREATE_TRANSFER_TX_RETURN: 'CREATE_TRANSFER_TX_RETURN',
  createTransferTx: (senderAddress, receiverAddress, token, amount) => ({
    type: graphqlActions.CREATE_TRANSFER_TX,
    params: {
      senderAddress,
      receiverAddress,
      token,
      amount,
    },
  }),

  CLEAR_TX_RETURN: 'CLEAR_TX_RETURN',
  clearTxReturn: () => ({
    type: graphqlActions.CLEAR_TX_RETURN,
  }),
};

export default graphqlActions;
