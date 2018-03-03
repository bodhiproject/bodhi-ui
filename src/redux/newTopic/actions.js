const topicActions = {
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
