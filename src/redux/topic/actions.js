const topicActions = {
  BET: 'BET',
  BET_RETURN: 'BET_RETURN',
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
  SET_RESULT: 'SET_RESULT',
  SET_RESULT_RETURN: 'SET_RESULT_RETURN',
  onSetResult: (contractAddress, resultIndex, senderAddress) => ({
    type: topicActions.SET_RESULT,
    payload: {
      contractAddress, resultIndex, senderAddress,
    },
  }),
  FINALIZE_RESULT: 'FINALIZE_RESULT',
  FINALIZE_RESULT_RETURN: 'FINALIZE_RESULT_RETURN',
  onFinalizeResult: (contractAddress, senderAddress) => ({
    type: topicActions.FINALIZE_RESULT,
    payload: {
      contractAddress, senderAddress,
    },
  }),
};
export default topicActions;
