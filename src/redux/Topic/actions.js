const topicActions = {
  GET_BET_AND_VOTE_BALANCES: 'GET_BET_VOTE_BALANCES',
  GET_BET_VOTE_BALANCES_RETURN: 'GET_BET_VOTE_BALANCES_RETURN',
  getBetAndVoteBalances: (contractAddress, senderAddress) => ({
    type: topicActions.GET_BET_VOTE_BALANCES,
    params: {
      contractAddress,
      senderAddress,
    }
  }),

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  calculateWinnings: (contractAddress, senderAddress) => ({
    type: topicActions.CALCULATE_WINNINGS,
    params: {
      contractAddress,
      senderAddress,
    },
  }),
};

export default topicActions;
