import _ from 'lodash';

export const TYPE = {
  topic: 'Topic',
  oracle: 'Oracle',
  syncInfo: 'SyncInfo',
  transaction: 'Transaction',
};

const TYPE_DEF = {
  Topic: `
    version
    address
    name
    options
    blockNum
    status
    resultIdx
    qtumAmount
    botAmount
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
    }`,

  Oracle: `
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
  `,

  SyncInfo: `
    syncBlockNum
    syncBlockTime
    chainBlockNum
  `,

  Transaction: `
    txid
    blockNum
    gasUsed
    createdTime
    version
    type
    status
    senderAddress
    topicAddress
    oracleAddress
    optionIdx
    token
    amount
  `,
};

const MUTATIONS = {
  createTopic: {
    mapping: [
      'senderAddress',
      'name',
      'options',
      'resultSetterAddress',
      'bettingStartTime',
      'bettingEndTime',
      'resultSettingStartTime',
      'resultSettingEndTime',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      senderAddress
    `,
  },

  createBet: {
    mapping: [
      'version',
      'oracleAddress',
      'optionIdx',
      'amount',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      topicAddress
      oracleAddress
      optionIdx
      amount
      senderAddress
    `,
  },

  setResult: {
    mapping: [
      'version',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      topicAddress
      oracleAddress
      optionIdx
      amount
      senderAddress
    `,
  },

  createVote: {
    mapping: [
      'version',
      'topicAddress',
      'oracleAddress',
      'optionIdx',
      'amount',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      topicAddress
      oracleAddress
      optionIdx
      amount
      senderAddress
    `,
  },

  finalizeResult: {
    mapping: [
      'version',
      'oracleAddress',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      oracleAddress
      senderAddress
    `,
  },

  withdraw: {
    mapping: [
      'version',
      'topicAddress',
      'senderAddress',
    ],
    return: `
      txid
      createdTime
      version
      type
      status
      topicAddress
      senderAddress
    `,
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
    'CREATEEVENT',
    'BET',
    'APPROVESETRESULT',
    'SETRESULT',
    'APPROVEVOTE',
    'VOTE',
    'FINALIZERESULT',
    'WITHDRAW',
    'TRANSFER',
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
