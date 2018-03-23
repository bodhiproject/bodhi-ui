import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  getPendingTransactionsReturn: { count: 0 },
});

export default function graphqlReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_TOPICS_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTopicsReturn', {
          data: action.value,
          limit: action.limit,
          skip: action.skip,
        });
      }

      // Not first page, add to existing data
      return state.set('getTopicsReturn', {
        data: [...state.get('getTopicsReturn').data, ...action.value],
        limit: action.limit,
        skip: action.skip,
      });
    }

    case actions.GET_ORACLES_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getOraclesReturn', {
          data: action.value,
          limit: action.limit,
          skip: action.skip,
        });
      }

      // Not first page, add to existing data
      return state.set('getOraclesReturn', {
        data: [...state.get('getOraclesReturn').data, ...action.value],
        limit: action.limit,
        skip: action.skip,
      });
    }

    case actions.GET_TRANSACTIONS_RETURN: {
      return state.set('getTransactionsReturn', action.value);
    }
    case actions.GET_PENDING_TRANSACTIONS_RETURN: {
      return state.set('getPendingTransactionsReturn', action.value)
        .set('pendingTxsSnackbarVisible', true);
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
        return state.set('txReturn', { error: action.error });
      }
      return state.set('txReturn', action.value);
    }
    case actions.CLEAR_TX_RETURN: {
      return state.set('txReturn', undefined);
    }
    default: {
      return state;
    }
  }
}
