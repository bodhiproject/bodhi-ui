/* eslint-disable */
import { default as graphql } from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import typeDefs from './schema.graphql';


// const mocks = {
//   Query: () => ...,
//   Mutation: () => ...
// };

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({
  schema,
  // mocks
});

const apolloCache = new InMemoryCache(window.__APOLLO_STATE__);

const mockClient = new ApolloClient({
  cache: apolloCache,
  link: new SchemaLink({ schema }),
});

const gql = ([str]) => {
  const { query, mutate } = mockClient;
  return str.includes('query') ? query({ query: graphql(str) }) : mutate({ mutation: graphql(str) });
}
// const query = (q) => client.query({ query: gql`query { ${q} }` });
// const mutation = (q) => client.mutation({ mutation: gql`mutation { ${q} }` });

// export { query, mutation };

export { mockClient, gql };
