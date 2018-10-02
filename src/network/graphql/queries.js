import _ from 'lodash';
import gql from 'graphql-tag';
import { Transaction, Oracle, Topic, SyncInfo } from 'models';

import client from './';
import { TYPE, isValidEnum, getTypeDef } from './schema';
import { isProduction } from '../../config/app';

if (!isProduction()) {
  window.queries = '';
}

class GraphQuery {
  constructor(queryName, type) {
    this.queryName = queryName;
    this.type = type;
    this.filters = undefined;
    this.orderBy = undefined;
    this.params = {};
    this.searchPhrase = undefined;
  }

  setFilters(filters) {
    this.filters = filters;
  }

  setOrderBy(orderBy) {
    this.orderBy = orderBy;
  }

  setSearchPhrase(phrase) {
    this.searchPhrase = phrase;
  }

  addParam(key, value) {
    this.params[key] = value;
  }

  formatObject(obj) {
    const str = Object
      .keys(obj)
      .map((key) => {
        const value = obj[key];
        if (_.isArray(value)) return `${key}: [${value.map((val) => JSON.stringify(val))}]`;
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

  getSearchPhraseString() {
    let phraseStr = '';
    if (this.searchPhrase) {
      phraseStr = JSON.stringify(this.searchPhrase);
    }
    return _.isEmpty(phraseStr) ? '' : `searchPhrase: ${phraseStr}`;
  }

  getParamsString() {
    let str = '';
    const keys = Object.keys(this.params);
    if (keys.length > 0) {
      _.each(keys, (key) => {
        if (!_.isEmpty(str)) {
          str = str.concat(', ');
        }

        str = str.concat(`${key}: ${this.params[key]}`);
      });
    }
    return str;
  }

  build() {
    const filterStr = this.getFilterString();
    const orderByStr = this.getOrderByString();
    const searchPhraseStr = this.getSearchPhraseString();
    const paramsStr = this.getParamsString();
    const needsParentheses = !_.isEmpty(filterStr) || !_.isEmpty(orderByStr) || !_.isEmpty(paramsStr) || !_.isEmpty(searchPhraseStr);

    const parenthesesOpen = needsParentheses ? '(' : '';
    const parenthesesClose = needsParentheses ? ')' : '';

    const query = `
      query {
        ${this.queryName}${parenthesesOpen}
          ${searchPhraseStr}
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
    // Post query to window
    if (!isProduction()) {
      window.queries += `\n${query}`;
    }

    const res = await client.query({
      query: gql`${query}`,
      fetchPolicy: 'network-only',
    });
    return res.data[this.queryName];
  }
}

/*
* Queries allTopics from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'ASC' }
*/
export function queryAllTopics(app, filters, orderBy, limit, skip) {
  const request = new GraphQuery('allTopics', TYPE.topic);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (_.isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (_.isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  return request.execute().then((result) => _.map(result, (topic) => new Topic(topic, app)));
}

/*
* Queries allOracles from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const request = new GraphQuery('allOracles', TYPE.oracle);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (_.isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (_.isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  return request.execute().then((result) => _.map(result, (oracle) => new Oracle(oracle, app)));
}

/*
* Queries allVotes from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export function queryAllVotes(filters, orderBy) {
  const request = new GraphQuery('allVotes', TYPE.vote);
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
export function queryAllTransactions(filters, orderBy, limit, skip) {
  const request = new GraphQuery('allTransactions', TYPE.transaction);
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (_.isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (_.isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  return request.execute().then((result) => _.map(result, (tx) => new Transaction(tx)));
}

/*
* Queries syncInfo from GraphQL.
* @param includeBalances {Boolean} Should include address balances array
*/
export function querySyncInfo(includeBalance) {
  const request = new GraphQuery('syncInfo', TYPE.syncInfo);
  if (includeBalance) {
    request.addParam('includeBalance', includeBalance);
  }
  return request.execute().then((result) => new SyncInfo(result));
}

/**
 * Search for Oracles that contains phrase either in title or result setter address
 * @param {String} phrase The keyword param for search
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} Search result from graphql
 */
export function searchOracles(app, phrase, filters, orderBy) {
  const request = new GraphQuery('searchOracles', TYPE.oracle);
  if (!_.isEmpty(phrase)) {
    request.setSearchPhrase(phrase);
  }
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  request.addParam('limit', 1000); // how to do unlimited search??
  return request.execute().then((result) => _.map(result, (oracle) => new Oracle(oracle, app)));
}

/**
 * Search for Topics that contains phrase either in title or result setter address
 * @param {String} phrase The keyword param for search
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} Search result from graphql
 */
export function searchTopics(app, phrase, filters, orderBy) {
  const request = new GraphQuery('searchTopics', TYPE.topic);
  if (!_.isEmpty(phrase)) {
    request.setSearchPhrase(phrase);
  }
  if (!_.isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!_.isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  request.addParam('limit', 1000);
  return request.execute().then((result) => _.map(result, (topic) => new Topic(topic, app)));
}
