import _ from 'lodash';

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
      startTime
      endTime
      resultSetStartTime
      resultSetEndTime
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
    startTime
    endTime
    resultSetStartTime
    resultSetEndTime
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
  const isEnum = _.has(ENUMS, key);
  const isValid = _.includes(ENUMS[key], value);
  return isEnum && isValid;
}

export function getQueryFields(queryName) {
  return FIELD_MAPPINGS[queryName];
}
