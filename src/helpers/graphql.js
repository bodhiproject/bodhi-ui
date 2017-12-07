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
