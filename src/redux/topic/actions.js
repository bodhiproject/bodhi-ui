const topicActions = {

  EDITING_TOGGLED: 'EDITING_TOGGLED',
  editingToggled: () => ({
    type: topicActions.EDITING_TOGGLED,
  }),

  REQ_RETURN: 'REQ_RETURN',
  CLEAR_REQ_RETURN: 'CLEAR_REQ_RETURN',
  onClearRequestReturn: () => ({
    type: topicActions.CLEAR_REQ_RETURN,
  }),

  BET: 'BET',
  BET_RETURN: 'BET_RETURN',
  onBet: (contractAddress, index, amount, senderAddress) => ({
    type: topicActions.BET,
    payload: {
      contractAddress,
      index,
      amount,
      senderAddress,
    },
  }),

  VOTE: 'VOTE',
  VOTE_RETURN: 'VOTE_RETURN',
  onVote: (contractAddress, index, amount, senderAddress) => ({
    type: topicActions.VOTE,
    payload: {
      contractAddress,
      index,
      amount,
      senderAddress,
    },
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
  SET_RESULT: 'SET_RESULT',
  SET_RESULT_RETURN: 'SET_RESULT_RETURN',
  CLEAR_SET_RESULT_RETURN: 'CLEAR_SET_RESULT_RETURN',
  onSetResult: (contractAddress, resultIndex, senderAddress) => ({
    type: topicActions.SET_RESULT,
    payload: {
      contractAddress,
      resultIndex,
      senderAddress,
    },
  }),
  FINALIZE_RESULT: 'FINALIZE_RESULT',
  FINALIZE_RESULT_RETURN: 'FINALIZE_RESULT_RETURN',
  CLEAR_FINALIZE_RESULT_RETURN: 'CLEAR_FINALIZE_RESULT_RETURN',
  onFinalizeResult: (contractAddress, senderAddress) => ({
    type: topicActions.FINALIZE_RESULT,
    payload: {
      contractAddress,
      senderAddress,
    },
  }),

  WITHDRAW: 'WITHDRAW',
  WITHDRAW_RETURN: 'WITHDRAW_RETURN',
  onWithdraw: (contractAddress,senderAddress) =>({
    type: topicActions.WITHDRAW,
    payload: {
      contractAddress,
      senderAddress
    }
  })
};
export default topicActions;
