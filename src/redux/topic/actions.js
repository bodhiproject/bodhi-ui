const topicActions = {
  CREATE: 'CREATE',
  CREATE_RESULT: 'CREATE_RESULT',
  BET: 'BET',
  BET_RESULT: 'BET_RESULT',
  CLEAR_BET_RESULT: 'CLEAR_BET_RESULT',
  CLEAR_CREATE_RESULT: 'CLEAR_CREATE_RESULT',
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
  onCreate: (params) => ({
    type: topicActions.CREATE,
    payload: params,
  }),
  onClearBetResult: () => ({
    type: topicActions.CLEAR_BET_RESULT,
  }),
  onClearCreateResult: () => ({
    type: topicActions.CLEAR_CREATE_RESULT,
  }),
};
export default topicActions;
