import _ from 'lodash';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { endpoint } from '../config/app';
import GraphParser from './graphParser';
import { getQueryFields } from './graphDataStruct';

const client = new ApolloClient({
  link: new HttpLink({ uri: endpoint.graphql }),
  cache: new InMemoryCache(),
});

class GraphRequest {
  constructor(queryName) {
    this.queryName = queryName;
    this.filters = {};
  }

  setFilters(filters) {
    this.filters = filters;
  }

  build() {
    let query = `query {${this.queryName}`;

    if (_.isEmpty(this.filters)) {
      query = query.concat('{');
    } else {
      let filterStr = '';

      _.forEach(this.filters, (obj, index) => {
        if (!_.isEmpty(filterStr)) {
          filterStr = filterStr.concat(',');
        }
        const str = Object.keys(obj).map((key) => `${key}: ${JSON.stringify(obj[key])}`).join(',');
        filterStr = filterStr.concat(`{${str}}`);
      });

      query = query.concat(`(
        filter: { 
          OR: [ 
            ${filterStr} 
          ]
        }
      ) {`);
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

/*
* Queries allTopics from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
*/
export function queryAllTopics(filters) {
  const request = new GraphRequest('allTopics');
  if (filters) {
    request.setFilters(filters);
  }
  return request.execute();
}

/*
* Queries allOracles from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
*/
export function queryAllOracles(filters) {
  const request = new GraphRequest('allOracles');
  if (filters) {
    request.setFilters(filters);
  }
  return request.execute();
}

// export async function queryOracles() {
//   const query = gql`
//     query oracles($token: _TokenType) {
//       allOracles(filter: {
//         OR: [
//           { status: WAITRESULT, token: $token }
//           { status: OPENRESULTSET, token: $token }
//         ]
//       }) {
//         address
//         status
//         token
//         name
//       }
//     }
//   `;

//   const res = await client.query({
//     query,
//     fetchPolicy: 'network-only',
//     variables: {
//       token: 'QTUM',
//     },
//   });

//   console.log(res);
// }

/*
* Queries syncInfo from GraphQL.
*/
export function querySyncInfo() {
  return new GraphRequest('syncInfo').execute();
}
