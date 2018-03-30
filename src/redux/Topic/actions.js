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
  getBetAndVoteBalances: (contractAddress, walletAddresses) => ({
    type: topicActions.GET_BET_AND_VOTE_BALANCES,
    contractAddress,
    walletAddresses,
  }),

  GET_WITHDRAWABLE_ADDRESSES: 'GET_WITHDRAWABLE_ADDRESSES',
  GET_WITHDRAWABLE_ADDRESSES_RETURN: 'GET_WITHDRAWABLE_ADDRESSES_RETURN',
  getWithdrawableAddresses: (eventAddress, walletAddresses) => ({
    type: topicActions.GET_WITHDRAWABLE_ADDRESSES,
    eventAddress,
    walletAddresses,
  }),

  CLEAR_ERROR_TOPIC: 'CLEAR_ERROR_TOPIC',
  clearErrorTopic: () => ({
    type: topicActions.CLEAR_ERROR_TOPIC,
  }),
};

export default topicActions;
