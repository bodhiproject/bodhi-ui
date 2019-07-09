import { gql } from 'apollo-boost';
import { map } from 'lodash';
import {
  MultipleResultsEvent,
  Bet,
  ResultSet,
  Withdraw,
  Transaction,
  SyncInfo,
  TotalResultBets,
} from 'models';
import {
  PAGINATED_EVENTS,
  MULTIPLE_RESULTS_EVENT,
  PAGINATED_BETS,
  PAGINATED_RESULT_SETS,
  PAGINATED_WITHDRAWS,
  PAGINATED_TRANSACTIONS,
  SYNC_INFO,
  TOTAL_RESULT_BETS,
  ALL_STATS,
  PAGINATED_MOST_BETS,
  PAGINATED_BIGGEST_WINNER,
  PAGINATED_LEADERBOARD_ENTRY,
} from './schema';

const QUERY_EVENTS = 'events';
const QUERY_SEARCH_EVENTS = 'searchEvents';
const QUERY_WITHDRAWABLE_EVENTS = 'withdrawableEvents';
const QUERY_BETS = 'bets';
const QUERY_RESULT_SETS = 'resultSets';
const QUERY_WITHDRAWS = 'withdraws';
const QUERY_TRANSACTIONS = 'transactions';
const QUERY_SYNC_INFO = 'syncInfo';
const QUERY_TOTAL_RESULT_BETS = 'totalResultBets';
const QUERY_ALL_STATS = 'allStats';
const QUERY_MOST_BETS = 'mostBets';
const QUERY_BIGGEST_WINNERS = 'biggestWinners';
const QUERY_EVENT_LEADERBOARD_ENTRIES = 'eventLeaderboardEntries';
const QUERY_GLOBAL_LEADERBOARD_ENTRIES = 'globalLeaderboardEntries';
/**
 * Example query arguments:
 * - filter: { status: 'BETTING' }
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
      $includeRoundBets: Boolean
      $roundBetsAddress: String
    ) {
      events(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
        pendingTxsAddress: $pendingTxsAddress
        includeRoundBets: $includeRoundBets
        roundBetsAddress: $roundBetsAddress
      ) {
        ${PAGINATED_EVENTS}
      }
    }
  `,

  searchEvents: gql`
    query(
      $filter: SearchEventsFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
      $searchPhrase: String
      $includeRoundBets: Boolean
      $roundBetsAddress: String
    ) {
      searchEvents(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
        searchPhrase: $searchPhrase
        includeRoundBets: $includeRoundBets
        roundBetsAddress: $roundBetsAddress
      ) {
        ${MULTIPLE_RESULTS_EVENT}
      }
    }
  `,

  withdrawableEvents: gql`
    query(
      $filter: WithdrawableEventFilter!
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
      $includeRoundBets: Boolean
      $roundBetsAddress: String
    ) {
      withdrawableEvents(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
        includeRoundBets: $includeRoundBets
        roundBetsAddress: $roundBetsAddress
      ) {
        ${PAGINATED_EVENTS}
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

  transactions: gql`
    query(
      $filter: TransactionFilter
      $limit: Int
      $skip: Int
      $transactionSkips: TransactionSkips
    ) {
      transactions(
        filter: $filter
        limit: $limit
        skip: $skip
        transactionSkips: $transactionSkips
      ) {
        ${PAGINATED_TRANSACTIONS}
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

  totalResultBets: gql`
    query(
      $filter: TotalResultBetsFilter
    ) {
      totalResultBets(
        filter: $filter
      ) {
        ${TOTAL_RESULT_BETS}
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
        ${PAGINATED_BIGGEST_WINNER}
      }
    }
  `,

  eventLeaderboardEntries: gql`
    query(
      $filter: LeaderboardEntryFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      eventLeaderboardEntries(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${PAGINATED_LEADERBOARD_ENTRY}
      }
    }
  `,

  globalLeaderboardEntries: gql`
    query(
      $filter: LeaderboardEntryFilter
      $orderBy: [Order!]
      $limit: Int
      $skip: Int
    ) {
      globalLeaderboardEntries(
        filter: $filter
        orderBy: $orderBy
        limit: $limit
        skip: $skip
      ) {
        ${PAGINATED_LEADERBOARD_ENTRY}
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
      fetchPolicy: 'no-cache', // for fixing transactions query
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
  const res = await new GraphQuery(client, QUERY_EVENTS, args).execute();
  const tmp = {};
  tmp.items = map(res.items, (event) => new MultipleResultsEvent(event));
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  return tmp;
}

/**
 * Searches all events by a search phrase.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function searchEvents(client, args) {
  const res = await new GraphQuery(client, QUERY_SEARCH_EVENTS, args).execute();
  return map(res, (event) => new MultipleResultsEvent(event));
}

/**
 * Queries events that the user can withdraw from.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function withdrawableEvents(client, args) {
  const res = await new GraphQuery(client, QUERY_WITHDRAWABLE_EVENTS, args)
    .execute();
  const tmp = {};
  tmp.items = map(res.items, (event) => new MultipleResultsEvent(event));
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  return tmp;
}

/**
 * Queries all bets.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function bets(client, args) {
  const res = await new GraphQuery(client, QUERY_BETS, args).execute();
  const tmp = {};
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  tmp.items = map(res.items, (bet) => new Bet(bet));
  return tmp;
}

/**
 * Queries all result sets.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function resultSets(client, args) {
  const res = await new GraphQuery(client, QUERY_RESULT_SETS, args).execute();
  const tmp = {};
  tmp.items = map(res.items, (resultSet) => new ResultSet(resultSet));
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  return tmp;
}

/**
 * Queries all withdraws.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function withdraws(client, args) {
  const res = await new GraphQuery(client, QUERY_WITHDRAWS, args).execute();
  const tmp = {};
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  tmp.items = map(res.items, (withdraw) => new Withdraw(withdraw));
  return tmp;
}

/**
 * Queries all transactions.
 * Returns concatenated list of Events, Bets, ResultSets, and Withdraws.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function transactions(client, args) {
  const res = await new GraphQuery(client, QUERY_TRANSACTIONS, args).execute();
  const tmp = {};
  tmp.items = map(res.items, (tx) => new Transaction(tx));
  tmp.pageInfo = res.pageInfo;
  tmp.totalCount = res.totalCount;
  return tmp;
}

/**
 * Queries sync info.
 * @param {ApolloClient} client Apollo Client instance.
 * @return {object} Query result.
 */
export async function syncInfo(client) {
  const res = await new GraphQuery(client, QUERY_SYNC_INFO).execute();
  return new SyncInfo(res);
}

/**
 * Queries the total result bets for an event.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function totalResultBets(client, args) {
  const res = await new GraphQuery(client, QUERY_TOTAL_RESULT_BETS, args).execute();
  return new TotalResultBets(res);
}

/**
 * Queries sync info.
 * @param {ApolloClient} client Apollo Client instance.
 * @return {object} Query result.
 */
export async function allStats(client) {
  return new GraphQuery(client, QUERY_ALL_STATS).execute();
}

/**
 * Queries most bets given the filters.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function mostBets(client, args) {
  return new GraphQuery(client, QUERY_MOST_BETS, args).execute();
}

/**
 * Queries the biggest winners based on an event address.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function biggestWinners(client, args) {
  return new GraphQuery(client, QUERY_BIGGEST_WINNERS, args).execute();
}

/**
 * Queries the event leaderboard entry based on event address and/or user address.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function eventLeaderboardEntries(client, args) {
  return new GraphQuery(client, QUERY_EVENT_LEADERBOARD_ENTRIES, args).execute();
}

/**
 * Queries the global leaderboard entry based on a user address.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the query.
 * @return {object} Query result.
 */
export async function globalLeaderboardEntries(client, args) {
  const res = await new GraphQuery(client, QUERY_GLOBAL_LEADERBOARD_ENTRIES, args).execute();
  return res;
}
