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
const FIELD_MAPPINGS = {
  allTopics: FIELDS_TOPIC,
  allOracles: FIELDS_ORACLE,
};
const PARSER_MAPPINGS = {
  allTopics: parseTopic,
  allOracles: parseOracle,
};

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

    query = query.concat(FIELD_MAPPINGS[this.queryName]);
    query = query.concat('}}');

    return query;
  }

  execute() {
    const query = this.build();

    return client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    }).then((res) => {
      const data = res.data[this.queryName].map((entry) => PARSER_MAPPINGS[this.queryName](entry));
      return data;
    });
  }
}

function parseTopic(entry) {
  return {
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
  };
}

function parseOracle(entry) {
  return {
    token: entry.token,
    address: entry.address,
    topicAddress: entry.topicAddress,
    status: entry.status,
    name: entry.name,
    options: entry.options,
    optionIdxs: entry.optionIdxs,
    resultIdx: entry.resultIdx,
    amounts: entry.amounts,
    startBlock: entry.startBlock,
    endBlock: entry.endBlock,
    blockNum: entry.blockNum,
    resultSetStartBlock: entry.resultSetStartBlock,
    resultSetEndBlock: entry.resultSetEndBlock,
    resultSetterAddress: entry.resultSetterAddress,
    resultSetterQAddress: entry.resultSetterQAddress,
    consensusThreshold: entry.consensusThreshold,
  };
}

export default GraphRequest;
