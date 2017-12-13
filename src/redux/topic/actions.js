const topicActions = {
  BET: 'BET',
  BET_RESULT: 'BET_RESULT',
  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: topicActions.EDITING_TOGGLED,
  }),
  onBet: (index, amount, senderAddress) => ({
    type: topicActions.BET,
    payload: { index, amount, senderAddress },
  }),
};
export default topicActions;
