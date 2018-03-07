module.exports = {
  Token: {
    Qtum: 'QTUM',
    Bot: 'BOT',
  },

  EventStatus: {
    Bet: 0,
    Set: 1,
    Vote: 2,
    Finalize: 3,
    Withdraw: 4,
    Default: 0,
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

  TransactionStatus: {
    Pending: 'PENDING',
    Success: 'SUCCESS',
    Fail: 'FAIL',
  },

  SortBy: {
    Ascending: 'ASC',
    Descending: 'DESC',
  },
};
