import { gql } from 'apollo-boost';
import { map } from 'lodash';
import { MultipleResultsEvent, Bet, ResultSet, Withdraw, SyncInfo } from 'models';
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

/**
 * Example query arguments:
 * - filter: [{ status: 'BETTING' }]
 * - orderBy: [{ field: 'blockNum', direction: 'ASC' }]
 * - limit: 100
 * - skip: 50
 * - searchPhrase: 'How much is Apple going to be worth in 2019'
 * - pendingTxsAddress: '0xd5d087daabc73fc6cc5d9c1131b93acbd53a2428'
 */
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
  constructor(client, queryName, args) {
    this.client = client;
    this.queryName = queryName;
    this.query = QUERIES[queryName];
    this.args = args;
  }

  async execute() {
    const res = await this.client.query({
      query: this.query,
      variables: this.args,
      fetchPolicy: 'network-only',
    });
    return res.data[this.queryName];
  }
}

/**
 * Queries all events.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function events(client, args) {
  const res = await new GraphQuery(client, 'events', args).execute();
  res.items = map(res.items, (event) => new MultipleResultsEvent(event));
  return res;
}

/**
 * Searches all events by a search phrase.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function searchEvents(client, args) {
  const res = await new GraphQuery(client, 'searchEvents', args).execute();
  return map(res, (event) => new MultipleResultsEvent(event));
}

/**
 * Queries all bets.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function bets(client, args) {
  const res = await new GraphQuery(client, 'bets', args).execute();
  res.items = map(res.items, (bet) => new Bet(bet));
  return res;
}

/**
 * Queries all result sets.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function resultSets(client, args) {
  const res = await new GraphQuery(client, 'resultSets', args).execute();
  res.items = map(res.items, (resultSet) => new ResultSet(resultSet));
  return res;
}

/**
 * Queries all withdraws.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function withdraws(client, args) {
  const res = await new GraphQuery(client, 'withdraws', args).execute();
  res.items = map(res.items, (withdraw) => new Withdraw(withdraw));
  return res;
}

/**
 * Queries sync info.
 * @param {ApolloClient} client Apollo Client instance.
 * @return {object} Query result.
 */
export async function syncInfo(client) {
  const res = await new GraphQuery(client, 'syncInfo').execute();
  return new SyncInfo(res);
}

/**
 * Queries sync info.
 * @param {ApolloClient} client Apollo Client instance.
 * @return {object} Query result.
 */
export async function allStats(client) {
  return new GraphQuery('allStats', client).execute();
}

/**
 * Queries most bets given the filters.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function mostBets(client, args) {
  return new GraphQuery(client, 'mostBets', args).execute();
}

/**
 * Queries the biggest winners based on an event address.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function biggestWinners(client, args) {
  return new GraphQuery(client, 'biggestWinners', args).execute();
}
