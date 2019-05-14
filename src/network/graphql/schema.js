import { gql } from 'apollo-boost';
import { has, includes } from 'lodash';

export const QUERY = {
  events: gql`{
    events(
      filter: EventFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
      pendingTxsAddress: String
    ): PaginatedEvents!  
  }`,

  searchEvents: gql`{
    searchEvents(
      searchPhrase: String
      filter: EventFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): [MultipleResultsEvent]!
  }`,

  bets: gql`{
    bets(
      filter: BetFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): PaginatedBets!
  }`,

  resultSets: gql`{
    resultSets(
      filter: ResultSetFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): PaginatedResultSets!
  }`,

  withdraws: gql`{
    withdraws(
      filter: WithdrawFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): PaginatedWithdraws!
  }`,

  syncInfo: gql`{
    syncInfo: SyncInfo!
  }`,

  allStats: gql`{
    allStats(
      filter: BetFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): AllStats!
  }`,

  mostBets: gql`{
    mostBets(
      filter: BetFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): PaginatedMostBets!
  }`,

  biggestWinners: gql`{
    biggestWinners(
      filter: BetFilter
      orderBy: [Order!]
      limit: Int
      skip: Int
    ): [BiggestWinner]!
  }`,
};

export const TYPE = {
  MULTIPLE_RESULTS_EVENT: 'MultipleResultsEvents',
  PAGINATED_EVENTS: 'PaginatedEvents',
  BET: 'Bet',

  topic: 'Topic',
  oracle: 'Oracle',
  vote: 'Vote',
  syncInfo: 'SyncInfo',
  transaction: 'Transaction',
  paginatedOracles: 'PaginatedOracles',
  paginatedTopics: 'PaginatedTopics',
  paginatedAccumulatedVotes: 'PaginatedAccumulatedVotes',
  winners: 'Winner',
  resultSet: 'ResultSet',
  withdraw: 'Withdraw',
  leaderboardStats: 'LeaderboardStats',
};

const TOPIC_DEF = {
  Topic: `
    txid
    version
    address
    name
    options
    blockNum
    status
    resultIdx
    qtumAmount
    botAmount
    escrowAmount
    creatorAddress
    language
    oracles {
      version
      address
      topicAddress
      status
      token
      name
      options
      optionIdxs
      amounts
      resultIdx
      blockNum
      startTime
      endTime
      resultSetStartTime
      resultSetEndTime
      resultSetterAddress
      consensusThreshold
    }
    transactions {
      type
      status
    }
  `,
};

const ORACLE_DEF = {
  Oracle: `
    txid
    version
    address
    topicAddress
    status
    token
    name
    options
    optionIdxs
    amounts
    resultIdx
    blockNum
    startTime
    endTime
    resultSetStartTime
    resultSetEndTime
    resultSetterAddress
    consensusThreshold
    transactions {
      type
      status
    }
    hashId
    language
  `,
};

const TYPE_DEF = {
  Topic: TOPIC_DEF.Topic,

  Oracle: ORACLE_DEF.Oracle,

  PaginatedOracles: `
    totalCount
    oracles {
      ${ORACLE_DEF.Oracle}
    }
    pageInfo {
      hasNextPage
      pageNumber
      count
    }
  `,

  PaginatedTopics: `
    totalCount
    topics {
      ${TOPIC_DEF.Topic}
    }
    pageInfo {
      hasNextPage
      pageNumber
      count
    }
  `,
  Vote: `
    txid
    block {
      blockNum
      blockTime
    }
    voterAddress
    topicAddress
    oracleAddress
    optionIdx
    amount
    version
    token
    type
  `,

  ResultSet: `
    txid
    block {
      blockNum
      blockTime
    }
    topicAddress
    oracleAddress
    fromAddress
    resultIdx
    version
  `,

  Withdraw: `
    txid
    block {
      blockNum
      blockTime
    }
    topicAddress
    withdrawerAddress
    qtumAmount
    botAmount
    version
    type
  `,

  SyncInfo: `
    syncBlockNum
    syncBlockTime
    syncPercent
    peerNodeCount
    addressBalances {
      address
      qtum
      bot
    }
  `,

  LeaderboardStats: `
    eventCount
    participantsCount
    totalQtum
    totalBot
  `,

  PaginatedAccumulatedVotes: `
    totalCount
    votes {
      topicAddress
      voterAddress
      amount
    }
    pageInfo {
      hasNextPage
      pageNumber
      count
    }
  `,
  Winner: `
    topicAddress
    voterAddress
    amount{
      bot
      qtum
    }
  `,

  Transaction: `
    type
    status
    txid
    createdBlock
    createdTime
    blockNum
    blockTime
    gasLimit
    gasPrice
    gasUsed
    senderAddress
    receiverAddress
    topicAddress
    oracleAddress
    name
    options
    optionIdx
    amount
    token
    resultSetterAddress
    bettingStartTime
    bettingEndTime
    resultSettingStartTime
    resultSettingEndTime
    topic {
      address
      name
      options
    }
    version
    language
  `,
};

const MUTATIONS = {
  resetApprove: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'receiverAddress',
      'topicAddress',
      'oracleAddress',
    ],
    return: TYPE_DEF.Transaction,
  },

  approveCreateEvent: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'name',
      'options',
      'resultSetterAddress',
      'bettingStartTime',
      'bettingEndTime',
      'resultSettingStartTime',
      'resultSettingEndTime',
      'amount',
      'language',
    ],
    return: TYPE_DEF.Transaction,
  },

  createEvent: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'name',
      'options',
      'resultSetterAddress',
      'bettingStartTime',
      'bettingEndTime',
      'resultSettingStartTime',
      'resultSettingEndTime',
      'amount',
      'language',
    ],
    return: TYPE_DEF.Transaction,
  },

  createBet: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },

  approveSetResult: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },

  setResult: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },

  approveVote: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },

  createVote: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },

  finalizeResult: {
    mapping: [
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
      'oracleAddress',
    ],
    return: TYPE_DEF.Transaction,
  },

  withdraw: {
    mapping: [
      'type',
      'txid',
      'gasLimit',
      'gasPrice',
      'senderAddress',
      'topicAddress',
    ],
    return: TYPE_DEF.Transaction,
  },

  transfer: {
    mapping: [
      'senderAddress',
      'receiverAddress',
      'token',
      'amount',
    ],
    return: TYPE_DEF.Transaction,
  },
};

const ENUMS = {
  direction: [
    'ASC',
    'DESC',
  ],

  status: [
    'CREATED',
    'VOTING',
    'WAITRESULT',
    'OPENRESULTSET',
    'PENDING',
    'WITHDRAW',
    'SUCCESS',
    'FAIL',
  ],

  type: [
    'APPROVECREATEEVENT',
    'CREATEEVENT',
    'BET',
    'APPROVESETRESULT',
    'SETRESULT',
    'APPROVEVOTE',
    'VOTE',
    'FINALIZERESULT',
    'WITHDRAW',
    'WITHDRAWESCROW',
    'TRANSFER',
    'RESETAPPROVE',
  ],

  token: [
    'QTUM',
    'BOT',
  ],
};

export function isValidEnum(key, value) {
  const isEnum = has(ENUMS, key);
  const isValid = includes(ENUMS[key], value);
  return isEnum && isValid;
}

export function getTypeDef(queryName) {
  return TYPE_DEF[queryName];
}

export function getMutation(mutationName) {
  return MUTATIONS[mutationName];
}
