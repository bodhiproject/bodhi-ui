import _ from 'lodash';
import gql from 'graphql-tag';

import client from './graphClient';
import GraphParser from './graphParser';
import { TYPE, isValidEnum, getTypeDef } from './graphSchema';

class GraphQuery {
  constructor(queryName, type) {
    this.queryName = queryName;
    this.type = type;
    this.filters = undefined;
    this.orderBy = undefined;
    this.params = {};
  }

  setFilters(filters) {
    this.filters = filters;
  }

  setOrderBy(orderBy) {
    this.orderBy = orderBy;
  }

  addParam(key, value) {
    this.params[key] = value;
  }

  formatObject(obj) {
    const str = Object
      .keys(obj)
      .map((key) => {
        const value = obj[key];
        if (isValidEnum(key, value) || !_.isString(value)) {
          // Enums require values without quotes
          return `${key}: ${value}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');
    return `{ ${str} }`;
  }

  getFilterString() {
    let filterStr = '';
    if (this.filters) {
      // Create entire string for OR: [] as objects
      _.forEach(this.filters, (obj) => {
        if (!_.isEmpty(filterStr)) {
          filterStr = filterStr.concat(', ');
        }
        filterStr = filterStr.concat(this.formatObject(obj));
      });

      filterStr = `
        filter: { 
          OR: [ 
            ${filterStr} 
          ]
        }
      `;
    }
    return filterStr;
  }

  getOrderByString() {
    let orderByStr = '';
    if (this.orderBy) {
      orderByStr = this.formatObject(this.orderBy);
    }
    return _.isEmpty(orderByStr) ? '' : `orderBy: ${orderByStr}`;
  }

  getParamsString() {
    let str = '';
    if (Object.keys(this.params).length > 0) {
      str = str.concat(this.formatObject());
    }
    return str;
  }

  build() {
    const filterStr = this.getFilterString();
    const orderByStr = this.getOrderByString();
    const paramsStr = this.getParamsString();
    const needsParentheses = !_.isEmpty(filterStr) || !_.isEmpty(orderByStr) || !_.isEmpty(paramsStr);

    const parenthesesOpen = needsParentheses ? '(' : '';
    const parenthesesClose = needsParentheses ? ')' : '';

    const query = `
      query {
        ${this.queryName}${parenthesesOpen}
          ${filterStr}
          ${orderByStr}
          ${paramsStr}
        ${parenthesesClose} {
          ${getTypeDef(this.type)}
        }
      }
    `;

    return query;
  }

  async execute() {
    const query = this.build();
    console.debug(query);

    const res = await client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.type)(res.data[this.queryName]);
  }
}

/*
* Queries allTopics from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'ASC' }
*/
export function queryAllTopics(filters, orderBy) {
  const request = new GraphQuery('allTopics', TYPE.topic);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  return request.execute();
}

/*
* Queries allOracles from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllOracles(filters, orderBy) {
  const request = new GraphQuery('allOracles', TYPE.oracle);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  return request.execute();
}

/*
* Queries allTransactions from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllTransactions(filters, orderBy) {
  const request = new GraphQuery('allTransactions', TYPE.transaction);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  return request.execute();
}

/*
* Queries syncInfo from GraphQL.
* @param includeBalances {Boolean} Should include address balances array
*/
export function querySyncInfo(includeBalances) {
  const request = new GraphQuery('syncInfo', TYPE.syncInfo);
  if (includeBalances) {
    request.addParam('includeBalances', includeBalances);
  }

  return request.execute();
}
