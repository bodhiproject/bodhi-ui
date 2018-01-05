import _ from 'lodash';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { endpoint } from '../config/app';

const { graphql } = endpoint;

const client = new ApolloClient({
  link: new HttpLink({ uri: graphql }),
  cache: new InMemoryCache(),
});

const ALL_TOPICS = gql`
query{
  allTopics{
    address
    creatorAddress
    name
    options
    blockNum
    status
    resultIdx
    qtumAmount
    botAmount
    oracles{
      address
      topicAddress
      status
      token
      name
      optionIdxs
      options
      amounts
      resultIdx
      blockNum
      endBlock
      resultSetEndBlock
      resultSetterAddress
      resultSetterQAddress
      consensusThreshold
    }
  }
}
`;

const ALL_ORACLES = gql`
  query {
    allOracles {
      token
      address
      topicAddress
      status
      name
      options
      optionIdxs
      resultIdx
      amounts
      endBlock
      blockNum
      resultSetEndBlock
      resultSetterAddress
      resultSetterQAddress
      consensusThreshold
    }
  }
`;

const SYNC_INFO = gql`
query{
  syncInfo{
    syncBlockNum
    chainBlockNum
  }
}
`;

export function queryAllTopics() {
  return client.query({
    query: ALL_TOPICS,
    fetchPolicy: 'network-only',
  }).then((res) => {
    const queryName = 'allTopics';
    const queryData = res.data[queryName].map((entry) => ({
      address: entry.address,
      creatorAddress: entry.creatorAddress,
      name: entry.name,
      options: entry.options,
      bettingEndBlock: entry.blockNum,
      status: entry.status,
      resultIdx: entry.resultIdx,
      qtumAmount: entry.qtumAmount,
      botAmount: entry.botAmount,
      oracles: entry.oracles,
      blockNum: entry.blockNum,
    }));

    return queryData;
  });
}

export function queryAllOracles() {
  return client.query({
    query: ALL_ORACLES,
    fetchPolicy: 'network-only',
  }).then((res) => {
    const queryName = 'allOracles';
    const queryData = res.data[queryName].map((entry) => ({
      token: entry.token,
      address: entry.address,
      topicAddress: entry.topicAddress,
      status: entry.status,
      name: entry.name,
      options: entry.options,
      optionIdxs: entry.optionIdxs,
      resultIdx: entry.resultIdx,
      amounts: entry.amounts,
      endBlock: entry.endBlock,
      blockNum: entry.blockNum,
      resultSetEndBlock: entry.resultSetEndBlock,
      resultSetterAddress: entry.resultSetterAddress,
      resultSetterQAddress: entry.resultSetterQAddress,
      consensusThreshold: entry.consensusThreshold,
    }));

    return queryData;
  });
}

export function querySyncInfo() {
  return client.query({
    query: SYNC_INFO,
    fetchPolicy: 'network-only',
  }).then((res) => {
    const queryName = 'syncInfo';
    return _.pick(res.data[queryName], ['syncBlockNum', 'chainBlockNum']);
  });
}
