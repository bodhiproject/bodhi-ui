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
    qtumPrediction: 'QtumPrediction',
    bet: 'Bet',
    botCourt: 'BotCourt',
    vote: 'Vote',
    wallet: 'Wallet',
    myActivities: 'MyActivities',
    resultSet: 'ResultSet',
    finalize: 'Finalize',
    withdraw: 'Withdraw',
    activityHistory: 'ActivityHistory',
    allEvents: 'AllEvents',
  },

  Phases: {
    bet: 'bet',
    vote: 'vote',
    setResult: 'setResult',
    finalize: 'finalize',
    withdraw: 'withdraw',
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
