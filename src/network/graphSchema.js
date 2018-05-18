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
  `,

  Vote: `
    txid
    version
    blockNum
    voterAddress
    voterQAddress
    topicAddress
    oracleAddress
    optionIdx
    amount
  `,

  SyncInfo: `
    syncBlockNum
    syncBlockTime
    syncPercent
    addressBalances {
      address
      qtum
      bot
    }
  `,

  Transaction: `
    type
    txid
    status
    createdTime
    blockNum
    blockTime
    gasLimit
    gasPrice
    gasUsed
    version
    senderAddress
    receiverAddress
    topicAddress
    oracleAddress
    name
    optionIdx
    token
    amount
    topic {
      address
      name
      options
    }
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
      senderAddress
    `,
  },

  createBet: {
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
      'topicAddress',
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
      'type',
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
