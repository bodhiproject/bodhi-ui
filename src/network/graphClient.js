import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import Routes from '../network/routes';

const httpLink = new HttpLink({
  uri: Routes.graphql.http,
});

// the check for process.browser makes sure our tests run
// properly since this can only be run in the browser. Source: http://tinyurl.com/ycsjfq6p
const wsLink = process.browser && new WebSocketLink({
  uri: Routes.graphql.subs,
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = process.browser ? split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
) : httpLink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
