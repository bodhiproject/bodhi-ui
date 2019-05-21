module.exports = {
  EVENT_STATUS: {
    CREATED: 'CREATED',
    BETTING: 'BETTING',
    ORACLE_RESULT_SETTING: 'ORACLE_RESULT_SETTING',
    OPEN_RESULT_SETTING: 'OPEN_RESULT_SETTING',
    ARBITRATION: 'ARBITRATION',
    WITHDRAWING: 'WITHDRAWING',
  },

  Routes: {
    PREDICTION: '/',
    ARBITRATION: '/arbitration',
    WALLET: '/wallet',
    SET: '/activities/set',
    WITHDRAW: '/activities/withdraw',
    ACTIVITY_HISTORY: '/activities/history',
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
    WITHDRAWING: 'WITHDRAWING',
  },

  EventStatus: {
    BET: 0,
    SET: 1,
    VOTE: 2,
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
    NAKA: 'NAKA',
    NBOT: 'NBOT',
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
    CREATE_EVENT: 'CREATE_EVENT',
    BET: 'BET',
    RESULT_SET: 'RESULT_SET',
    VOTE: 'VOTE',
    WITHDRAW: 'WITHDRAW',
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
