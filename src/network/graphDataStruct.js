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
    version
    type
    txid
    txStatus
    senderAddress
    senderQAddress
    entityId
    optionIdx
    token
    amount
    gasUsed
    blockNum
    blockTime
    createTime
    createBlockNum
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

  createOracle: `
    CreateOracle(
      $version: Int!,
      $name: String!,
      $options: [String!]!,
      $resultSetterAddress: String!,
      $bettingStartTime: String!,
      $bettingEndTime: String!,
      $resultSettingStartTime: String!,
      $resultSettingEndTime: String!
      $senderAddress: String!
    ) {
      createOracle(
        version: $version,
        name: $name,
        options: $options,
        resultSetterAddress: $resultSetterAddress,
        bettingStartTime: $bettingStartTime,
        bettingEndTime: $bettingEndTime,
        resultSettingStartTime: $resultSettingStartTime,
        resultSettingEndTime: $resultSettingEndTime
        senderAddress: $senderAddress,
      ) {
        version
        name
        options
        resultSetterAddress
        bettingStartTime
        bettingEndTime
        resultSettingStartTime
        resultSettingEndTime
        senderAddress
      }
    }
  `,

  createBet: `
    CreateBet(
      $version: Int!,
      $oracleAddress: String!,
      $optionIdx: Int!,
      $amount: String!,
      $senderAddress: String!
    ) {
      createBet(
        version: $version,
        oracleAddress: $oracleAddress,
        optionIdx: $optionIdx,
        amount: $amount,
        senderAddress: $senderAddress
      ) {
        version
        oracleAddress
        optionIdx
        amount
        senderAddress
      }
    }
  `,

  setResult: `
    SetResult(
      $version: Int!,
      $senderAddress: String!,
      $oracleAddress: String!,
      $consensusThreshold: String!,
      $resultIdx: Int!
    ) {
      setResult(
        version: $version,
        senderAddress: $senderAddress,
        oracleAddress: $oracleAddress,
        consensusThreshold: $consensusThreshold,
        resultIdx: $resultIdx
      ) {
        version
        senderAddress
        oracleAddress
        consensusThreshold
        resultIdx
      }
    }
  `,

  createVote: `
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

  finalizeResult: `
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

  withdraw: `
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
