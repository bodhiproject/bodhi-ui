import { Map } from 'immutable';

import actions from './actions';
import { EventStatus, TransactionStatus, TransactionType, OracleStatus } from '../../constants';

const initState = new Map({
  getPendingTransactionsReturn: { count: 0 },
  actionableItemCount: {
    [EventStatus.Set]: 0,
    [EventStatus.Finalize]: 0,
    [EventStatus.Withdraw]: 0,
    totalCount: 0,
  },
  error: null, // type: object
});

/**
 * Takes an oracle object and returns which phase it is in.
 * @param {oracle} oracle
 */
const getPhase = ({ token, status }) => {
  if (token === 'QTUM' && status === 'VOTING') return 'betting';
  if (token === 'BOT' && status === 'VOTING') return 'voting';
  if (token === 'QTUM' && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return 'resultSetting';
  if (token === 'BOT' && status === 'WAITRESULT') return 'finalizing';
  throw Error('invalid phase');
};

export default function graphqlReducer(state = initState, action) {
  const { Pending } = TransactionStatus;

  switch (action.type) {
    case actions.GET_TOPICS_RETURN: {
      const { WithdrawEscrow, Withdraw } = TransactionType;
      const topics = action.value.map((topic) => {
        const pendingTypes = [WithdrawEscrow, Withdraw];
        const isPending = topic.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
        return {
          ...topic,
          isUpcoming: false,
          unconfirmed: isPending,
        };
      });
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTopicsReturn', {
          data: topics,
          limit: action.limit,
          skip: action.skip,
        });
      }

      // Not first page, add to existing data
      return state.set('getTopicsReturn', {
        data: [...state.get('getTopicsReturn').data, ...topics],
        limit: action.limit,
        skip: action.skip,
      });
    }

    case actions.GET_ORACLES_RETURN: {
      const oracles = action.value.map((oracle) => {
        const phase = getPhase(oracle);
        const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
        const pendingTypes = {
          betting: [Bet],
          voting: [ApproveVote, Vote],
          resultSetting: [ApproveSetResult, SetResult],
          finalizing: [FinalizeResult],
        }[phase] || [];
        const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
        const isUpcoming = phase === 'voting' && oracle.status === OracleStatus.WaitResult;
        return {
          unconfirmed: (!oracle.topicAddress && !oracle.address) || isPending,
          isUpcoming,
          phase,
          ...oracle,
        };
      });
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getOraclesReturn', {
          data: oracles,
          limit: action.limit,
          skip: action.skip,
        });
      }

      // Not first page, add to existing data
      return state.set('getOraclesReturn', {
        data: [...state.get('getOraclesReturn').data, ...oracles],
        limit: action.limit,
        skip: action.skip,
      });
    }

    case actions.GET_TRANSACTIONS_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTransactionsReturn', action.value);
      }

      // Not first page, add to existing data
      return state.set('getTransactionsReturn', [...state.get('getTransactionsReturn'), ...action.value]);
    }
    case actions.GET_PENDING_TRANSACTIONS_RETURN: {
      return state.set('getPendingTransactionsReturn', action.value);
    }
    case actions.GET_ACTIONABLE_ITEM_COUNT_RETURN: {
      return state.set('actionableItemCount', action.value);
    }
    case actions.CREATE_TOPIC_TX_RETURN:
    case actions.CREATE_BET_TX_RETURN:
    case actions.CREATE_SET_RESULT_TX_RETURN:
    case actions.CREATE_VOTE_TX_RETURN:
    case actions.CREATE_FINALIZE_RESULT_TX_RETURN:
    case actions.CREATE_WITHDRAW_TX_RETURN:
    case actions.CREATE_TRANSFER_TX_RETURN: {
      if (action.error) {
        return state.set('error', action.error);
      }
      return state.set('txReturn', action.value);
    }
    case actions.CLEAR_GRAPHQL_ERROR: {
      return state.set('error', null);
    }
    case actions.CLEAR_TX_RETURN: {
      return state.set('txReturn', undefined);
    }
    default: {
      return state;
    }
  }
}
