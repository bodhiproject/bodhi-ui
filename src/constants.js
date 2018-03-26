module.exports = {
  RouterPath: {
    qtumPrediction: '/',
    botCourt: '/bot-court',
    myWallet: '/my-wallet',
    set: '/activities/set',
    finalize: '/activities/finalize',
    withdraw: '/activities/withdraw',
    activityHistory: '/activities/history',
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
  },

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

  EventWarningType: {
    Info: 'info',
    Error: 'error',
    Highlight: 'highlight',
  },

  WithdrawType: {
    winnings: 'winnings',
    escrow: 'escrow',
  },

  /* GraphQL Constants */
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
