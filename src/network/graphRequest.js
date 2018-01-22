import _ from 'lodash';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { endpoint } from '../config/app';
import GraphParser from './graphParser';
import { getQueryFields } from './graphFields';

class GraphRequest {
  constructor(queryName) {
    this.queryName = queryName;
    this.filters = {};
    this.client = new ApolloClient({
      link: new HttpLink({ uri: endpoint.graphql }),
      cache: new InMemoryCache(),
    });
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
    const res = await this.client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.queryName)(res.data[this.queryName]);
  }
}

export default GraphRequest;
