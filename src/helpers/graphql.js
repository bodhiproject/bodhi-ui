import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5555/graphql' }),
  cache: new InMemoryCache(),
});

const ALL_TOPICS = gql`
query{
  allTopics{
    address,
    creatorAddress,
    name,
    options,
    blockNum
  }
}
`;

const ALL_ORACLES = gql`
  query AllOracles($topicAddress: String) {
    allOracles(filter: {
      topicAddress: $topicAddress
    }) {
      topicAddress
      token
      name
      status
      options
      optionIdxs
      resultIdx
      amounts
      endBlock
    }
  }
`;

export function queryAllTopics() {
  return client.query({ query: ALL_TOPICS }).then((res) => {
    const queryName = 'allTopics';
    const queryData = res.data[queryName].map((entry) => ({
      address: entry.address,
      name: entry.name,
      options: entry.options,
      bettingEndBlock: entry.blockNum,
      creatorAddress: entry.creatorAddress,
    }));
    console.log(queryData);
    return queryData;
  });
}

export function queryAllOracles(address) {
  return client.query({
    query: ALL_ORACLES,
    variables: {
      topicAddress: address,
    },
  }).then((res) => {
    const queryName = 'allOracles';
    const queryData = res.data[queryName].map((entry) => ({
      topicAddress: entry.topicAddress,
      token: entry.token,
      name: entry.name,
      status: entry.status,
      options: entry.options,
      optionIdxs: entry.optionIdxs,
      resultIdx: entry.resultIdx,
      amounts: entry.amounts,
      endBlock: entry.endBlock,
    }));
    console.log('Oracle data: ');
    console.log(queryData);
    return queryData;
  });
}
