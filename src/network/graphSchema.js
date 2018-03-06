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
  createTopic: `
    CreateTopic(
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
        senderAddress: $senderAddress,
        name: $name,
        options: $options,
        resultSetterAddress: $resultSetterAddress,
        bettingStartTime: $bettingStartTime,
        bettingEndTime: $bettingEndTime,
        resultSettingStartTime: $resultSettingStartTime,
        resultSettingEndTime: $resultSettingEndTime
      ) {
        txid
        createdTime
        version
        type
        status
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
      }
    }
  `,

  setResult: `
    SetResult(
      $version: Int!,
      $topicAddress: String!,
      $oracleAddress: String!,
      $optionIdx: Int!,
      $amount: String!,
      $senderAddress: String!
    ) {
      setResult(
        version: $version,
        topicAddress: $topicAddress,
        oracleAddress: $oracleAddress,
        optionIdx: $optionIdx,
        amount: $amount,
        senderAddress: $senderAddress
      ) {
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
      }
    }
  `,

  createVote: `
    CreateVote(
      $version: Int!,
      $topicAddress: String!,
      $oracleAddress: String!,
      $optionIdx: Int!,
      $amount: String!,
      $senderAddress: String!
    ) {
      createVote(
        version: $version,
        topicAddress: $topicAddress,
        oracleAddress: $oracleAddress,
        optionIdx: $optionIdx,
        amount: $amount,
        senderAddress: $senderAddress
      ) {
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
      }
    }
  `,

  finalizeResult: `
    FinalizeResult(
      $version: Int!,
      $oracleAddress: String!,
      $senderAddress: String!
    ) {
      finalizeResult(
        version: $version,
        oracleAddress: $oracleAddress,
        senderAddress: $senderAddress
      ) {
        txid
        createdTime
        version
        type
        status
        oracleAddress
        senderAddress
      }
    }
  `,

  withdraw: `
    Withdraw(
      $version: Int!,
      $topicAddress: String!,
      $senderAddress: String!
    ) {
      withdraw(
        version: $version,
        topicAddress: $topicAddress,
        senderAddress: $senderAddress
      ) {
        txid
        createdTime
        type
        status
        topicAddress
        senderAddress
      }
    }
  `,

  transfer: `
    Transfer(
      $version: Int!,
      $senderAddress: String!,
      $receiverAddress: String!,
      $token: _TokenType!,
      $amount: Int!
    ) {
      transfer(
        version: $version,
        senderAddress: $senderAddress,
        receiverAddress: $receiverAddress,
        token: $token,
        amount: $amount
      ) {
        txid
        createdTime
        type
        status
        senderAddress
        receiverAddress
        token
        amount
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
