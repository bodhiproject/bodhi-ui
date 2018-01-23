const ENUMS = {
  status: [
    'CREATED',
    'VOTING',
    'WAITRESULT',
    'OPENRESULTSET',
    'PENDING',
    'WITHDRAW',
  ],

  token: [
    'QTUM',
    'BOT',
  ],
};

const FIELD_MAPPINGS = {
  allTopics: `
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
      startBlock
      endBlock
      resultSetStartBlock
      resultSetEndBlock
      resultSetterAddress
      resultSetterQAddress
      consensusThreshold
    }`,

  allOracles: `
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
    startBlock
    endBlock
    resultSetStartBlock
    resultSetEndBlock
    resultSetterAddress
    resultSetterQAddress
    consensusThreshold
  `,

  syncInfo: `
    syncBlockNum
    chainBlockNum
  `,
};

export function isValidEnum(key, value) {
  return _.has(ENUMS, key) && _.has(ENUMS[key], value);
}

export function getQueryFields(queryName) {
  return FIELD_MAPPINGS[queryName];
}
