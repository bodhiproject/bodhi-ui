import { gql } from 'apollo-boost';
import { isArray, isString, forEach, isEmpty, each, isFinite, map } from 'lodash';
import { Transaction, Oracle, Topic, SyncInfo, Vote, ResultSet, Withdraw } from 'models';
import client from './';
import { TYPE_FIELDS } from './schema';
import { isProduction } from '../../config/app';

if (!isProduction()) {
  window.queries = '';
}

const QUERIES = {
  events: gql`
    query(
      $filter: EventFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
      $pendingTxsAddress: String
    ) {
      events(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
        pendingTxsAddress: $pendingTxsAddress
      ) {
        ${TYPE_FIELDS.PAGINATED_EVENTS}
      }
    }
  `,

  searchEvents: gql`
    query(
      $searchPhrase: String
      $filter: EventFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      searchEvents(
        searchPhrase: $searchPhrase
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.MULTIPLE_RESULTS_EVENT}
      }
    }
  `,

  bets: gql`
    query(
      $filter: BetFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      bets(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.PAGINATED_BETS}
      }
    }
  `,

  resultSets: gql`
    query(
      $filter: ResultSetFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      resultSets(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.PAGINATED_RESULT_SETS}
      }
    }
  `,

  withdraws: gql`
    query(
      $filter: WithdrawFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      withdraws(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.PAGINATED_WITHDRAWS}
      }
    }
  `,

  syncInfo: gql`
    query {
      syncInfo {
        ${TYPE_FIELDS.SYNC_INFO}
      }
    }
  `,

  allStats: gql`
    query(
      $filter: BetFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      allStats(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.ALL_STATS}
      }
    }
  `,

  mostBets: gql`
    query(
      $filter: BetFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      mostBets(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.PAGINATED_MOST_BETS}
      }
    }
  `,

  biggestWinners: gql`
    query(
      $filter: BetFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      biggestWinners(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${TYPE_FIELDS.BIGGEST_WINNER}
      }
    }
  `,
};

class GraphQuery {
  constructor(queryName) {
    this.queryName = queryName;
    this.query = QUERIES[queryName];
    this.filter = undefined;
    this.orderBy = undefined;
    this.limit = undefined;
    this.skip = undefined;
    this.searchPhrase = undefined;
    this.params = undefined;
  }

  setFilter = (filters) => {
    this.filter = filters;
  }

  setOrderBy = (orderBy) => {
    this.orderBy = orderBy;
  }

  setLimit = (limit) => {
    this.limit = limit;
  }

  setSkip = (skip) => {
    this.skip = skip;
  }

  setSearchPhrase = (phrase) => {
    this.searchPhrase = phrase;
  }

  addParam(key, value) {
    if (!this.params) this.params = {};
    this.params[key] = value;
  }

  // formatObject(obj) {
  //   const str = Object
  //     .keys(obj)
  //     .map((key) => {
  //       const value = obj[key];
  //       if (key === 'language') return ''; // remove this if we need filter based on language in the future
  //       if (isArray(value)) return `${key}: [${value.map((val) => JSON.stringify(val))}]`;
  //       if (isValidEnum(key, value) || !isString(value)) {
  //         // Enums require values without quotes
  //         return `${key}: ${value}`;
  //       }
  //       return `${key}: ${JSON.stringify(value)}`;
  //     })
  //     .join(', ');
  //   return `{ ${str} }`;
  // }

  // getFilterString() {
  //   let filterStr = '';
  //   if (this.filters) {
  //     // Create entire string for OR: [] as objects
  //     forEach(this.filters, (obj) => {
  //       if (!isEmpty(filterStr)) {
  //         filterStr = filterStr.concat(', ');
  //       }
  //       filterStr = filterStr.concat(this.formatObject(obj));
  //     });
  //     filterStr = `
  //     filter: {
  //       OR: [
  //         ${filterStr}
  //       ]
  //     }
  //     `;
  //   }
  //   return filterStr;
  // }

  // getOrderByString() {
  //   let orderByStr = '';
  //   if (this.orderBy) {
  //     orderByStr = this.formatObject(this.orderBy);
  //   }
  //   return isEmpty(orderByStr) ? '' : `orderBy: ${orderByStr}`;
  // }

  // getSearchPhraseString() {
  //   let phraseStr = '';
  //   if (this.searchPhrase) {
  //     phraseStr = JSON.stringify(this.searchPhrase);
  //   }
  //   return isEmpty(phraseStr) ? '' : `searchPhrase: ${phraseStr}`;
  // }

  // getParamsString() {
  //   let str = '';
  //   const keys = Object.keys(this.params);
  //   if (keys.length > 0) {
  //     each(keys, (key) => {
  //       if (!isEmpty(str)) {
  //         str = str.concat(', ');
  //       }

  //       str = str.concat(`${key}: ${this.params[key]}`);
  //     });
  //   }
  //   return str;
  // }

  // build() {
  //   const filterStr = this.getFilterString();
  //   const orderByStr = this.getOrderByString();
  //   const searchPhraseStr = this.getSearchPhraseString();
  //   const paramsStr = this.getParamsString();
  //   const needsParentheses = !isEmpty(filterStr)
  //     || !isEmpty(orderByStr)
  //     || !isEmpty(paramsStr)
  //     || !isEmpty(searchPhraseStr);

  //   const parenthesesOpen = needsParentheses ? '(' : '';
  //   const parenthesesClose = needsParentheses ? ')' : '';
  //   const query = `
  //     query {
  //       ${this.queryName}${parenthesesOpen}
  //         ${searchPhraseStr}
  //         ${filterStr}
  //         ${orderByStr}
  //         ${paramsStr}
  //       ${parenthesesClose} {
  //         ${getTypeDef(this.type)}
  //       }
  //     }
  //   `;
  //   return query;
  // }

  constructVariables = () => {
    const vars = {};
    if (this.filter) vars.filter = this.filter;
    if (this.orderBy) vars.orderBy = this.orderBy;
    if (this.limit) vars.limit = this.limit;
    if (this.skip) vars.skip = this.skip;
    if (this.searchPhrase) vars.searchPhrase = this.searchPhrase;
    if (this.params) {
      each(Object.keys(this.params), (key) => vars[key] = this.params[key]);
    }
  }

  async execute() {
    const res = await client.query({
      query: this.query,
      variables: this.constructVariables(),
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
export async function queryAllTopics(app, filters, orderBy, limit, skip) {
  const request = new GraphQuery('allTopics', TYPE.paginatedTopics);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  const result = await request.execute();

  return {
    totalCount: result.totalCount,
    topics: map(result.topics, (topic) => new Topic(topic, app)),
    pageInfo: result.pageInfo,
  };
}

/*
* Queries allOracles from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export async function queryAllOracles(app, filters, orderBy, limit, skip) {
  const request = new GraphQuery('allOracles', TYPE.paginatedOracles);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  const result = await request.execute();
  return {
    totalCount: result.totalCount,
    oracles: map(result.oracles, (oracle) => new Oracle(oracle, app)),
    pageInfo: result.pageInfo,
  };
}

/*
* Queries allVotes from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export async function queryAllVotes(filters, orderBy) {
  const request = new GraphQuery('allVotes', TYPE.vote);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  const result = await request.execute();
  return map(result, (vote) => new Vote(vote));
}

/*
* Queries allVotes from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export async function queryMostVotes(filters, orderBy, limit, skip) {
  const request = new GraphQuery('mostVotes', TYPE.paginatedAccumulatedVotes);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  const result = await request.execute();
  return result;
}

export async function queryWinners(filters, orderBy, limit, skip) {
  const request = new GraphQuery('winners', TYPE.winners);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  const result = await request.execute();
  return result;
}

export async function queryLeaderboardStats() {
  const request = new GraphQuery('leaderboardStats', TYPE.leaderboardStats);
  const result = await request.execute();
  return result;
}

/*
* Queries allTransactions from GraphQL with optional filters.
* @param filters {Array} Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
* @param orderBy {Object} Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
*/
export async function queryAllTransactions(filters, orderBy, limit, skip) {
  const request = new GraphQuery('allTransactions', TYPE.transaction);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  if (isFinite(limit) && limit > 0) {
    request.addParam('limit', limit);
  }
  if (isFinite(skip) && skip >= 0) {
    request.addParam('skip', skip);
  }
  const result = await request.execute();
  return map(result, (tx) => new Transaction(tx));
}

/*
* Queries syncInfo from GraphQL.
* @param includeBalances {Boolean} Should include address balances array
*/
export async function querySyncInfo(includeBalance) {
  const request = new GraphQuery('syncInfo', TYPE.syncInfo);
  if (includeBalance) {
    request.addParam('includeBalance', includeBalance);
  }
  const result = await request.execute();
  return new SyncInfo(result);
}

/**
 * Search for Oracles that contains phrase either in title or result setter address
 * @param {String} phrase The keyword param for search
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} Search result from graphql
 */
export async function searchOracles(app, phrase, filters, orderBy) {
  const request = new GraphQuery('searchOracles', TYPE.oracle);
  if (!isEmpty(phrase)) {
    request.setSearchPhrase(phrase);
  }
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  request.addParam('limit', 1000); // how to do unlimited search??
  const result = await request.execute();
  return map(result, (oracle) => new Oracle(oracle, app));
}

/**
 * Search for Topics that contains phrase either in title or result setter address
 * @param {String} phrase The keyword param for search
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} Search result from graphql
 */
export async function searchTopics(app, phrase, filters, orderBy) {
  const request = new GraphQuery('searchTopics', TYPE.topic);
  if (!isEmpty(phrase)) {
    request.setSearchPhrase(phrase);
  }
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  request.addParam('limit', 1000);
  const result = await request.execute();
  return map(result, (topic) => new Topic(topic, app));
}

/**
 * Search for Result Sets
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} result sets from graphql
 */
export async function queryResultSets(filters, orderBy) {
  const request = new GraphQuery('resultSets', TYPE.resultSet);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  const result = await request.execute();
  return map(result, (resultset) => new ResultSet(resultset));
}

/**
 * Search for withdraws
 * @param {Array} filters Array of objects for filtering. ie. [{ status: 'WAITRESULT' }, { status: 'OPENRESULTSET' }]
 * @param {Object} orderBy Object with order by fields. ie. { field: 'blockNum', direction: 'DESC' }
 * @return {Promise} Search result from graphql
 */
export async function queryWithdraws(filters, orderBy) {
  const request = new GraphQuery('withdraws', TYPE.withdraw);
  if (!isEmpty(filters)) {
    request.setFilters(filters);
  }
  if (!isEmpty(orderBy)) {
    request.setOrderBy(orderBy);
  }
  const result = await request.execute();
  return map(result, (withdraw) => new Withdraw(withdraw));
}
