import { gql } from 'apollo-boost';
import { isEmpty, each, isFinite } from 'lodash';
import { SyncInfo } from 'models';
import client from '.';
import {
  PAGINATED_EVENTS,
  MULTIPLE_RESULTS_EVENT,
  PAGINATED_BETS,
  PAGINATED_RESULT_SETS,
  PAGINATED_WITHDRAWS,
  SYNC_INFO,
  ALL_STATS,
  PAGINATED_MOST_BETS,
  BIGGEST_WINNER,
} from './schema';

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
        ${PAGINATED_EVENTS}
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
        ${MULTIPLE_RESULTS_EVENT}
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
        ${PAGINATED_BETS}
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
        ${PAGINATED_RESULT_SETS}
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
        ${PAGINATED_WITHDRAWS}
      }
    }
  `,

  syncInfo: gql`
    query {
      syncInfo {
        ${SYNC_INFO}
      }
    }
  `,

  allStats: gql`
    query {
      allStats {
        ${ALL_STATS}
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
        ${PAGINATED_MOST_BETS}
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
        ${BIGGEST_WINNER}
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
    const res = await client().query({
      query: this.query,
      variables: this.constructVariables(),
      fetchPolicy: 'network-only',
    });
    return res.data[this.queryName];
  }
}

/**
 * Queries all events.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {array} orderBy Array of order by fields. e.g. [{ field: 'blockNum', direction: 'ASC' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function events(filter, orderBy, limit, skip) {
  const request = new GraphQuery('events');
  if (!isEmpty(filter)) request.setFilter(filter);
  if (!isEmpty(orderBy)) request.setOrderBy(orderBy);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Searches all events by a search phrase.
 * @param {string} searchPhrase Phrase to search events.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {array} orderBy Array of order by fields. e.g. [{ field: 'blockNum', direction: 'ASC' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function searchEvents(searchPhrase, filter, orderBy, limit, skip) {
  const request = new GraphQuery('searchEvents');
  request.setSearchPhrase(searchPhrase);
  if (!isEmpty(filter)) request.setFilter(filter);
  if (!isEmpty(orderBy)) request.setOrderBy(orderBy);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Queries all bets.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {array} orderBy Array of order by fields. e.g. [{ field: 'blockNum', direction: 'ASC' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function bets(filter, orderBy, limit, skip) {
  const request = new GraphQuery('bets');
  if (!isEmpty(filter)) request.setFilter(filter);
  if (!isEmpty(orderBy)) request.setOrderBy(orderBy);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Queries all result sets.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {array} orderBy Array of order by fields. e.g. [{ field: 'blockNum', direction: 'ASC' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function resultSets(filter, orderBy, limit, skip) {
  const request = new GraphQuery('resultSets');
  if (!isEmpty(filter)) request.setFilter(filter);
  if (!isEmpty(orderBy)) request.setOrderBy(orderBy);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Queries all withdraws.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {array} orderBy Array of order by fields. e.g. [{ field: 'blockNum', direction: 'ASC' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function withdraws(filter, orderBy, limit, skip) {
  const request = new GraphQuery('withdraws');
  if (!isEmpty(filter)) request.setFilter(filter);
  if (!isEmpty(orderBy)) request.setOrderBy(orderBy);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Queries sync info.
 * @return {object} Query result.
 */
export async function syncInfo() {
  const request = new GraphQuery('syncInfo');
  const result = await request.execute();
  return new SyncInfo(result);
}

/**
 * Queries sync info.
 * @return {object} Query result.
 */
export async function allStats() {
  const request = new GraphQuery('allStats');
  return request.execute();
}

/**
 * Queries most bets given the filters.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @param {number} limit Max number of items per query.
 * @param {number} skip Amount of items to skip.
 * @return {object} Query result.
 */
export async function mostBets(filter, limit, skip) {
  const request = new GraphQuery('mostBets');
  if (!isEmpty(filter)) request.setFilter(filter);
  if (isFinite(limit) && limit > 0) request.setLimit(limit);
  if (isFinite(skip) && skip >= 0) request.setSkip(skip);
  return request.execute();
}

/**
 * Queries the biggest winners based on an event address.
 * @param {array} filter Array of filters. e.g. [{ status: 'BETTING' }]
 * @return {object} Query result.
 */
export async function biggestWinners(filter) {
  const request = new GraphQuery('biggestWinners');
  if (!isEmpty(filter)) request.setFilter(filter);
  return request.execute();
}
