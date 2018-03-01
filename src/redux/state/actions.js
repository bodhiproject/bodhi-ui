const stateActions = {
  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: stateActions.EDITING_TOGGLED,
  }),

  CLEAR_EDITING_TOGGLED: 'CLEAR_EDITING_TOGGLED',
  clearEditingToggled: () => ({
    type: stateActions.CLEAR_EDITING_TOGGLED,
  }),

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  onCalculateWinnings: (contractAddress, senderAddress) => ({
    type: stateActions.CALCULATE_WINNINGS,
    payload: {
      contractAddress,
      senderAddress,
    },
  }),
};

export default stateActions;
