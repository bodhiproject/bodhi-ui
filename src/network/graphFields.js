const FIELDS_TOPIC = `
  version
  address
  name
  options
  blockNum
  status
  resultIdx
  qtumAmount
  botAmount
  oracles{
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
  }
`;

const FIELDS_ORACLE = `
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
`;

const FIELDS_SYNC_INFO = `
  syncBlockNum
  chainBlockNum
`;

const FIELD_MAPPINGS = {
  allTopics: FIELDS_TOPIC,
  allOracles: FIELDS_ORACLE,
  syncInfo: FIELDS_SYNC_INFO,
};

export function getQueryFields(queryName) {
  return FIELD_MAPPINGS[queryName];
}
