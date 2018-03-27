const topicActions = {
  GET_EVENT_ESCROW_AMOUNT: 'GET_EVENT_ESCROW_AMOUNT',
  GET_EVENT_ESCROW_AMOUNT_RETURN: 'GET_EVENT_ESCROW_AMOUNT_RETURN',
  getEventEscrowAmount: (senderAddress) => ({
    type: topicActions.GET_EVENT_ESCROW_AMOUNT,
    params: {
      senderAddress,
    },
  }),

  GET_BET_AND_VOTE_BALANCES: 'GET_BET_VOTE_BALANCES',
  GET_BET_VOTE_BALANCES_RETURN: 'GET_BET_VOTE_BALANCES_RETURN',
  getBetAndVoteBalances: (contractAddress, senderAddress) => ({
    type: topicActions.GET_BET_AND_VOTE_BALANCES,
    params: {
      contractAddress,
      senderAddress,
    },
  }),

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  calculateWinnings: (topic, walletAddresses, senderAddress) => ({
    type: topicActions.CALCULATE_WINNINGS,
    topic,
    walletAddresses,
    senderAddress,
  }),

  CLEAR_ERROR_TOPIC: 'CLEAR_ERROR_TOPIC',
  clearErrorTopic: () => ({
    type: topicActions.CLEAR_ERROR_TOPIC,
  }),
};

export default topicActions;
