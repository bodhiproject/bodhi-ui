import _ from 'lodash';

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
      resultSetterQAddress
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
    resultSetterQAddress
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
    voterQAddress
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
    topic {
      address
      name
      options
    }
    version
  `,
};

const MUTATIONS = {
  createTopic: {
    mapping: [
      'name',
      'options',
      'resultSetterAddress',
      'bettingStartTime',
      'bettingEndTime',
      'resultSettingStartTime',
      'resultSettingEndTime',
      'amount',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      token
      senderAddress
    `,
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
      'token',
      'version',
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
      'token',
      'version',
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
      'token',
      'version',
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
      'version',
      'topicAddress',
      'oracleAddress',
      'senderAddress',
    ],
    return: TYPE_DEF.Transaction,
  },

  withdraw: {
    mapping: [
      'type',
      'version',
      'topicAddress',
      'senderAddress',
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
    return: `
      txid
      createdTime
      version
      type
      status
      senderAddress
      receiverAddress
      token
      amount
    `,
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
  const isEnum = _.has(ENUMS, key);
  const isValid = _.includes(ENUMS[key], value);
  return isEnum && isValid;
}

export function getTypeDef(queryName) {
  return TYPE_DEF[queryName];
}

export function getMutation(mutationName) {
  return MUTATIONS[mutationName];
}
