/* eslint-disable */
import { default as graphql } from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import typeDefs from './schema.graphql';
import faker from 'faker';
import moment from 'moment';


const mocks = {
  // Query: () => ...,
  Mutation: () => ({
    /**
     * data: {
     *  senderAddress, name, options, resultSetterAddress,
     *  bettingStartTime, bettingEndTime, resultSettingEndTime,
     *  resultSettingEndTime, amount
     * }
     */
    createTopic: (root, data) => ({
      txid: faker.random.uuid(),
      type: 'CREATEEVENT',
      status: 'PENDING',
      createdTime: moment().unix(),
      gasLimit: (3500000).toString(10),
      gasPrice: (0.0000004).toFixed(8),
      version: 1,
      ...data,
      token: 'BOT',
    }),
  })
};

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  mocks
});

const apolloCache = new InMemoryCache(window.__APOLLO_STATE__);

const mockClient = new ApolloClient({
  cache: apolloCache,
  link: new SchemaLink({ schema }),
});

/**
 * Used like:
 * gql`
 *  query {
 *    allOracles {
 *      txid
 *    }
 *  }
 * `
 * @param {Array}
 */
const gql = ([str]) => {
  const { query, mutate } = mockClient;
  return str.includes('query') ? query({ query: graphql(str) }) : mutate({ mutation: graphql(str) });
}
// const query = (q) => client.query({ query: gql`query { ${q} }` });
// const mutation = (q) => client.mutation({ mutation: gql`mutation { ${q} }` });

// export { query, mutation };

export { mockClient, gql };
