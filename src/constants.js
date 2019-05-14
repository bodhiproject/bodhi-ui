export const EVENT_STATUS = {
  CREATED: 'CREATED',
  BETTING: 'BETTING',
  ORACLE_RESULT_SETTING: 'ORACLE_RESULT_SETTING',
  OPEN_RESULT_SETTING: 'OPEN_RESULT_SETTING',
  ARBITRATION: 'ARBITRATION',
  WITHDRAWING: 'WITHDRAWING',
};

module.exports = {
  Routes: {
    QTUM_PREDICTION: '/',
    BOT_COURT: '/bot-court',
    WALLET: '/wallet',
    SET: '/activities/set',
    FINALIZE: '/activities/finalize',
    WITHDRAW: '/activities/withdraw',
    ACTIVITY_HISTORY: '/activities/history',
    FAVORITE: '/activities/favorite',
    ALL_EVENTS: '/all-events',
    SETTINGS: '/settings',
    LEADERBOARD: '/leaderboard',
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
    ORANGE: 'ORANGE',
  },

  WalletProvider: {
    NAKA: 'NAKA',
    QT_WALLET: 'QT_WALLET',
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
    PENDING: 'PENDING',
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
    FAIL: 'FAIL',
  },

  SortBy: {
    DEFAULT: 'DESC',
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
  },

  TransactionGas: {
    CREATE_EVENT: 3500000,
    DORACLE_CREATE: 1500000,
  },
};
