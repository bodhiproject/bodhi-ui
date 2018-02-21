import _ from 'lodash';

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
    syncBlockTime
    chainBlockNum
  `,
};

const MUTATIONS = {
  createTopic: `
    CreateTopic(
      $version: Int!, 
      $senderAddress: String!,
      $name: String!,
      $options: [String!]!,
      $resultSetterAddress: String!,
      $bettingStartTime: String!,
      $bettingEndTime: String!,
      $resultSettingStartTime: String!,
      $resultSettingEndTime: String!
    ) {
      createTopic(
        version: $version,
        senderAddress: $senderAddress,
        name: $name,
        options: $options,
        resultSetterAddress: $resultSetterAddress,
        bettingStartTime: $bettingStartTime,
        bettingEndTime: $bettingEndTime,
        resultSettingStartTime: $resultSettingStartTime,
        resultSettingEndTime: $resultSettingEndTime
      ) {
        version
        senderAddress
        name
        options
        resultSetterAddress
        bettingStartTime
        bettingEndTime
        resultSettingStartTime
        resultSettingEndTime
      }
    }
  `,

  betTransaction: `
    CreateBet(
      $version: Int!,
      $senderAddress: String!,
      $oracleAddress: String!,
      $optionIdx: Int!,
      $amount: String!
    ) {
      createBet(
        version: $version,
        senderAddress: $senderAddress,
        oracleAddress: $oracleAddress,
        optionIdx: $optionIdx,
        amount: $amount
      ) {
        version
        senderAddress
        oracleAddress
        optionIdx
        amount
      }
    }
  `,

  voteTransaction: `
    CreateVote(
      $version: Int!,
      $senderAddress: String!,
      $oracleAddress: String!,
      $optionIdx: Int!,
      $amount: String!
    ) {
      createVote(
        version: $version,
        senderAddress: $senderAddress,
        oracleAddress: $oracleAddress,
        optionIdx: $optionIdx,
        amount: $amount
      ) {
        version
        senderAddress
        oracleAddress
        optionIdx
        amount
      }
    }
  `,

  finalizeResultTransaction: `
    FinalizeResult(
      $version: Int!,
      $senderAddress: String!,
      $oracleAddress: String!
    ) {
      finalizeResult(
        version: $version,
        senderAddress: $senderAddress,
        oracleAddress: $oracleAddress
      ) {
        version
        senderAddress
        oracleAddress
      }
    }
  `,

  withdrawTransaction: `
    Withdraw(
      $version: Int!,
      $senderAddress: String!,
      $topicAddress: String!
    ) {
      withdraw(
        version: $version,
        senderAddress: $senderAddress,
        topicAddress: $topicAddress
      ) {
        version
        senderAddress
        topicAddress
      }
    }
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

export function getMutation(mutationName) {
  return MUTATIONS[mutationName];
}
