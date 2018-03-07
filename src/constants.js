module.exports = {
  Token: {
    Qtum: 'QTUM',
    Bot: 'BOT',
  },

  /* Oracle status matching graphql _OracleStatusType */
  OracleStatus: {
    Created: 'CREATED',
    Voting: 'VOTING',
    WaitResult: 'WAITRESULT',
    OpenResultSet: 'OPENRESULTSET',
    Pending: 'PENDING',
    Withdraw: 'WITHDRAW',
  },

  TransactionType: {
    CreateEvent: 'CREATEEVENT',
    Bet: 'BET',
    ApproveSetResult: 'APPROVESETRESULT',
    SetResult: 'SETRESULT',
    ApproveVote: 'APPROVEVOTE',
    Vote: 'VOTE',
    FinalizeResult: 'FINALIZERESULT',
    Withdraw: 'WITHDRAW',
    Transfer: 'TRANSFER',
  },

  SortBy: {
    Ascending: 'ASC',
    Descending: 'DESC',
  },
};
