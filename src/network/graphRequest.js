import _ from 'lodash';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { endpoint } from '../config/app';
import GraphParser from './graphParser';
import { getQueryFields } from './graphFields';

const client = new ApolloClient({
  link: new HttpLink({ uri: endpoint.graphql }),
  cache: new InMemoryCache(),
});

class GraphRequest {
  constructor(queryName) {
    this.queryName = queryName;
    this.filters = {};
  }

  addFilter(key, value) {
    this.filters.key = value;
  }

  setFilters(filters) {
    this.filters = filters;
  }

  build() {
    let query = `query {${this.queryName}`;

    if (_.isEmpty(this.filters)) {
      query = query.concat('{');
    } else {
      const parsedFilters = Object
        .keys(this.filters)
        .map((key) => `${key}: ${JSON.stringify(this.filters[key])}`)
        .join(',');
      query = query.concat(`(filter: {${parsedFilters}}) {`);
    }

    const fields = getQueryFields(this.queryName);
    query = query.concat(fields).concat('}}');

    return query;
  }

  async execute() {
    const query = this.build();
    const res = await client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.queryName)(res.data[this.queryName]);
  }
}

export function queryAllTopics(filters) {
  const request = new GraphRequest('allTopics');
  if (filters) {
    request.setFilters(filters);
  }
  return request.execute();
}

export function queryAllOracles(filters) {
  const request = new GraphRequest('allOracles');
  if (filters) {
    request.setFilters(filters);
  }
  return request.execute();
}

export function querySyncInfo() {
  return new GraphRequest('syncInfo').execute();
}
