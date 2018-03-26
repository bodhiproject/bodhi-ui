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

  GET_WITHDRAWABLE_ADDRESSES: 'GET_WITHDRAWABLE_ADDRESSES',
  GET_WITHDRAWABLE_ADDRESSES_RETURN: 'GET_WITHDRAWABLE_ADDRESSES_RETURN',
  getWithdrawableAddresses: (topic, walletAddresses, senderAddress) => ({
    type: topicActions.GET_WITHDRAWABLE_ADDRESSES,
    topic,
    walletAddresses,
    senderAddress,
  }),

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  calculateWinnings: (contractAddress, walletAddresses, eventCreator) => ({
    type: topicActions.CALCULATE_WINNINGS,
    params: {
      contractAddress,
      walletAddresses,
      eventCreator,
    },
  }),

  CLEAR_ERROR_TOPIC: 'CLEAR_ERROR_TOPIC',
  clearErrorTopic: () => ({
    type: topicActions.CLEAR_ERROR_TOPIC,
  }),
};

export default topicActions;
