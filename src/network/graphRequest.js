import _ from 'lodash';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { endpoint } from '../config/app';
import GraphParser from './graphParser';

const { graphql } = endpoint;

const FIELDS_TOPIC = `
  version
  address
  name
  options
  blockNum
  status
  resultIdx
  qtumAmount
  botAmount
  oracles{
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
    startBlock
    endBlock
    resultSetStartBlock
    resultSetEndBlock
    resultSetterAddress
    resultSetterQAddress
    consensusThreshold
  }
`;
const FIELDS_ORACLE = `
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
  startBlock
  endBlock
  resultSetStartBlock
  resultSetEndBlock
  resultSetterAddress
  resultSetterQAddress
  consensusThreshold
`;
const FIELDS_SYNC_INFO = `
  syncBlockNum
  chainBlockNum
`;
const FIELD_MAPPINGS = {
  allTopics: FIELDS_TOPIC,
  allOracles: FIELDS_ORACLE,
  syncInfo: FIELDS_SYNC_INFO,
};

class GraphRequest {
  constructor(queryName) {
    this.queryName = queryName;
    this.filters = {};
    this.client = new ApolloClient({
      link: new HttpLink({ uri: graphql }),
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

    query = query.concat(FIELD_MAPPINGS[this.queryName]);
    query = query.concat('}}');

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
