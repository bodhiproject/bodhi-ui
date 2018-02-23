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
  onVote: (contractAddress, resultIndex, botAmount, senderAddress) => ({
    type: topicActions.VOTE,
    payload: {
      contractAddress,
      resultIndex,
      botAmount,
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

  ALLOWANCE: 'ALLOWANCE',
  ALLOWANCE_RETURN: 'ALLOWANCE_RETURN',
  CLEAR_ALLOWANCE_RETURN: 'CLEAR_ALLOWANCE_RETURN',
  onAllowance: (owner, spender, senderAddress) => ({
    type: topicActions.ALLOWANCE,
    payload: {
      owner,
      spender,
      senderAddress,
    },
  }),
  clearAllowanceReturn: () => ({
    type: topicActions.CLEAR_ALLOWANCE_RETURN,
  }),
  APPROVE: 'APPROVE',
  APPROVE_RETURN: 'APPROVE_RETURN',
  onApprove: (contractAddress, spender, value, senderAddress) => ({
    type: topicActions.APPROVE,
    payload: {
      contractAddress,
      spender,
      value,
      senderAddress,
    },
  }),

  SET_RESULT: 'SET_RESULT',
  SET_RESULT_RETURN: 'SET_RESULT_RETURN',
  onSetResult: (contractAddress, resultIndex, consensusThreshold, senderAddress) => ({
    type: topicActions.SET_RESULT,
    payload: {
      contractAddress,
      resultIndex,
      consensusThreshold,
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

  CALCULATE_WINNINGS: 'CALCULATE_WINNINGS',
  CALCULATE_WINNINGS_RETURN: 'CALCULATE_WINNINGS_RETURN',
  onCalculateWinnings: (contractAddress, senderAddress) => ({
    type: topicActions.CALCULATE_WINNINGS,
    payload: {
      contractAddress,
      senderAddress,
    },
  }),

  WITHDRAW: 'WITHDRAW',
  WITHDRAW_RETURN: 'WITHDRAW_RETURN',
  onWithdraw: (contractAddress, senderAddress) => ({
    type: topicActions.WITHDRAW,
    payload: {
      contractAddress,
      senderAddress,
    },
  }),
};

export default topicActions;
