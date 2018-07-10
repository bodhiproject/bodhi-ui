module.exports = {
  RouterPath: {
    qtumPrediction: '/',
    botCourt: '/bot-court',
    myWallet: '/my-wallet',
    set: '/activities/set',
    finalize: '/activities/finalize',
    withdraw: '/activities/withdraw',
    activityHistory: '/activities/history',
    allEvents: '/all-events',
  },

  /* App Constants */
  AppLocation: {
    qtumPrediction: 'QTUM_PREDICTION',
    botCourt: 'BOT_COURT',
    wallet: 'WALLET',
    myActivities: 'MY_ACTIVITIES',
    resultSetting: 'RESULT_SETTING',
    finalize: 'FINALIZE',
    withdraw: 'WITHDRAW',
    activityHistory: 'ACTIVITY_HISTORY',
    allEvents: 'ALL_EVENTS',
  },

  Phases: {
    BETTING: 'BETTING',
    VOTING: 'VOTING',
    RESULT_SETTING: 'RESULT_SETTING',
    PENDING: 'PENDING',
    FINALIZING: 'FINALIZING',
    WITHDRAWING: 'WITHDRAWING',
  },

  EventStatus: {
    Bet: 0,
    Set: 1,
    Vote: 2,
    Finalize: 3,
    Withdraw: 4,
    AllEvents: 5,
    Default: 0,
  },

  EventWarningType: {
    Info: 'info',
    Error: 'error',
    Highlight: 'highlight',
  },

  /* GraphQL Constants */
  Token: {
    Qtum: 'QTUM',
    Bot: 'BOT',
  },

  OracleStatus: {
    Created: 'CREATED',
    Voting: 'VOTING',
    WaitResult: 'WAITRESULT',
    OpenResultSet: 'OPENRESULTSET',
    Pending: 'PENDING',
    Withdraw: 'WITHDRAW',
  },

  TransactionType: {
    ApproveCreateEvent: 'APPROVECREATEEVENT',
    CreateEvent: 'CREATEEVENT',
    Bet: 'BET',
    ApproveSetResult: 'APPROVESETRESULT',
    SetResult: 'SETRESULT',
    ApproveVote: 'APPROVEVOTE',
    Vote: 'VOTE',
    FinalizeResult: 'FINALIZERESULT',
    Withdraw: 'WITHDRAW',
    WithdrawEscrow: 'WITHDRAWESCROW',
    Transfer: 'TRANSFER',
    ResetApprove: 'RESETAPPROVE',
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
