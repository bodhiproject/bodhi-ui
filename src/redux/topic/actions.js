const topicActions = {
  BET: 'BET',
  BET_RESULT: 'BET_RESULT',
  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: topicActions.EDITING_TOGGLED,
  }),
  onBet: (contractAddress, index, amount, senderAddress) => ({
    type: topicActions.BET,
    payload: {
      contractAddress, index, amount, senderAddress,
    },
  }),
};
export default topicActions;
