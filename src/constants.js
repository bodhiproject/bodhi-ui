module.exports = {
  Routes: {
    QTUM_PREDICTION: '/',
    BOT_COURT: '/bot-court',
    WALLET: '/wallet',
    SET: '/activities/set',
    FINALIZE: '/activities/finalize',
    WITHDRAW: '/activities/withdraw',
    ACTIVITY_HISTORY: '/activities/history',
    ALL_EVENTS: '/all-events',
    SETTINGS: '/settings',
    SEARCH: '/search',
  },

  EventType: {
    UNCONFIRMED: 'UNCONFIRMED',
    TOPIC: 'TOPIC',
    ORACLE: 'ORACLE',
  },

  Phases: {
    UNCONFIRMED: 'UNCONFIRMED', // BETTING
    BETTING: 'BETTING',
    PENDING: 'PENDING', // VOTING
    VOTING: 'VOTING',
    RESULT_SETTING: 'RESULT_SETTING',
    FINALIZING: 'FINALIZING',
    WITHDRAWING: 'WITHDRAWING',
  },

  EventStatus: {
    BET: 0,
    SET: 1,
    VOTE: 2,
    FINALIZE: 3,
    WITHDRAW: 4,
  },

  EventWarningType: {
    INFO: 'INFO',
    ERROR: 'ERROR',
    HIGHLIGHT: 'HIGHLIGHT',
  },

  /* GraphQL Constants */
  Token: {
    QTUM: 'QTUM',
    BOT: 'BOT',
  },

  OracleStatus: {
    CREATED: 'CREATED',
    VOTING: 'VOTING',
    WAIT_RESULT: 'WAITRESULT',
    OPEN_RESULT_SET: 'OPENRESULTSET',
    PENDING: 'PENDING', // not used
    WITHDRAW: 'WITHDRAW',
  },

  TransactionType: {
    APPROVE_CREATE_EVENT: 'APPROVECREATEEVENT',
    CREATE_EVENT: 'CREATEEVENT',
    BET: 'BET',
    APPROVE_SET_RESULT: 'APPROVESETRESULT',
    SET_RESULT: 'SETRESULT',
    APPROVE_VOTE: 'APPROVEVOTE',
    VOTE: 'VOTE',
    FINALIZE_RESULT: 'FINALIZERESULT',
    WITHDRAW: 'WITHDRAW',
    WITHDRAW_ESCROW: 'WITHDRAWESCROW',
    TRANSFER: 'TRANSFER',
    RESET_APPROVE: 'RESETAPPROVE',
  },

  TransactionStatus: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL', // not used
  },

  SortBy: {
    DEFAULT: 'DESC',
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
  },
};
