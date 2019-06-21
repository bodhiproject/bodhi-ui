import { gql } from 'apollo-boost';
import { MultipleResultsEvent, Bet, ResultSet, Withdraw } from 'models';
import { MULTIPLE_RESULTS_EVENT, BET, RESULT_SET, WITHDRAW } from './schema';

const MUTA_ADD_PENDING_EVENT = 'addPendingEvent';
const MUTA_ADD_PENDING_BET = 'addPendingBet';
const MUTA_ADD_PENDING_RESULT_SET = 'addPendingResultSet';
const MUTA_ADD_PENDING_WITHDRAW = 'addPendingWithdraw';

const MUTATIONS = {
  addPendingEvent: gql`
    mutation(
      $txid: String!
      $ownerAddress: String!
      $name: String!
      $results: [String!]!
      $numOfResults: Int!
      $centralizedOracle: String!
      $betEndTime: Int!
      $resultSetStartTime: Int!
      $language: String!
    ) {
      addPendingEvent(
        txid: $txid
        ownerAddress: $ownerAddress
        name: $name
        results: $results
        numOfResults: $numOfResults
        centralizedOracle: $centralizedOracle
        betEndTime: $betEndTime
        resultSetStartTime: $resultSetStartTime
        language: $language
      ) {
        ${MULTIPLE_RESULTS_EVENT}
      }
    }
  `,

  addPendingBet: gql`
    mutation(
      $txid: String!
      $eventAddress: String!
      $betterAddress: String!
      $resultIndex: Int!
      $amount: String!
      $eventRound: Int!
    ) {
      addPendingBet(
        txid: $txid
        eventAddress: $eventAddress
        betterAddress: $betterAddress
        resultIndex: $resultIndex
        amount: $amount
        eventRound: $eventRound
      ) {
        ${BET}
      }
    }
  `,

  addPendingResultSet: gql`
    mutation(
      $txid: String!
      $eventAddress: String!
      $centralizedOracleAddress: String!
      $resultIndex: Int!
      $amount: String!
      $eventRound: Int!
    ) {
      addPendingResultSet(
        txid: $txid
        eventAddress: $eventAddress
        centralizedOracleAddress: $centralizedOracleAddress
        resultIndex: $resultIndex
        amount: $amount
        eventRound: $eventRound
      ) {
        ${RESULT_SET}
      }
    }
  `,

  addPendingWithdraw: gql`
    mutation(
      $txid: String!
      $eventAddress: String!
      $winnerAddress: String!
      $winningAmount: String!
      $escrowAmount: String!
    ) {
      addPendingWithdraw(
        txid: $txid
        eventAddress: $eventAddress
        winnerAddress: $winnerAddress
        winningAmount: $winningAmount
        escrowAmount: $escrowAmount
      ) {
        ${WITHDRAW}
      }
    }
  `,
};

class GraphMutation {
  constructor(client, mutationName, args) {
    this.client = client;
    this.mutationName = mutationName;
    this.mutation = MUTATIONS[mutationName];
    this.args = args;
  }

  execute = async () =>
    this.client.mutate({
      mutation: this.mutation,
      variables: this.args,
      fetchPolicy: 'no-cache',
    });
}

/**
 * Creates a new pending MultipleResultsEvent.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the mutation.
 * @return {object} Mutation result.
 */
export const addPendingEvent = async (client, args) => {
  const res = await new GraphMutation(client, MUTA_ADD_PENDING_EVENT, args)
    .execute();
  const { data: { addPendingEvent: event } } = res;
  return new MultipleResultsEvent(event);
};

/**
 * Creates a new pending Bet.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the mutation.
 * @return {object} Mutation result.
 */
export const addPendingBet = async (client, args) => {
  const res = await new GraphMutation(client, MUTA_ADD_PENDING_BET, args)
    .execute();
  const { data: { addPendingBet: bet } } = res;
  return new Bet(bet);
};

/**
 * Creates a new pending Result Set.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the mutation.
 * @return {object} Mutation result.
 */
export const addPendingResultSet = async (client, args) => {
  const res = await new GraphMutation(client, MUTA_ADD_PENDING_RESULT_SET, args)
    .execute();
  const { data: { addPendingResultSet: resultSet } } = res;
  return new ResultSet(resultSet);
};

/**
 * Creates a new pending Withdraw.
 * @param {ApolloClient} client Apollo Client instance.
 * @param {object} args Arguments for the mutation.
 * @return {object} Mutation result.
 */
export const addPendingWithdraw = async (client, args) => {
  const res = await new GraphMutation(client, MUTA_ADD_PENDING_WITHDRAW, args)
    .execute();
  const { data: { addPendingWithdraw: withdraw } } = res;
  return new Withdraw(withdraw);
};
