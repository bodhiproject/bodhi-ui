const topicActions = {

  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: topicActions.EDITING_TOGGLED,
  }),
  CLEAR_EDITING_TOGGLED: 'CLEAR_EDITING_TOGGLED',
  clearEditingToggled: () => ({
    type: topicActions.CLEAR_EDITING_TOGGLED,
  }),

  REQ_RETURN: 'REQ_RETURN',
  CLEAR_REQ_RETURN: 'CLEAR_REQ_RETURN',
  onClearRequestReturn: () => ({
    type: topicActions.CLEAR_REQ_RETURN,
  }),

  CREATE: 'CREATE',
  CREATE_RETURN: 'CREATE_RETURN',
  CLEAR_CREATE_RETURN: 'CLEAR_CREATE_RETURN',
  onCreate: (params) => ({
    type: topicActions.CREATE,
    payload: params,
  }),
  onClearBetReturn: () => ({
    type: topicActions.CLEAR_BET_RETURN,
  }),
  onClearCreateReturn: () => ({
    type: topicActions.CLEAR_CREATE_RETURN,
  }),

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  onCalculateWinnings: (contractAddress, senderAddress) => ({
    type: topicActions.CALCULATE_WINNINGS,
    payload: {
      contractAddress,
      senderAddress,
    },
  }),
};

export default topicActions;
