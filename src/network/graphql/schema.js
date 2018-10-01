import { has, includes } from 'lodash';

export const TYPE = {
  topic: 'Topic',
  oracle: 'Oracle',
  vote: 'Vote',
  syncInfo: 'SyncInfo',
  transaction: 'Transaction',
};

const TYPE_DEF = {
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
  `,

  Vote: `
    txid
    blockNum
    voterAddress
    topicAddress
    oracleAddress
    optionIdx
    amount
    version
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
      'amount',
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
