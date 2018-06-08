import { Map } from 'immutable';

import actions from './actions';
import { EventStatus } from '../../constants';


const initState = new Map({
  getPendingTransactionsReturn: { count: 0 },
  actionableItemCount: {
    [EventStatus.Set]: 0,
    [EventStatus.Finalize]: 0,
    [EventStatus.Withdraw]: 0,
    totalCount: 0,
  },
  txReturn: null, // used to display TransactionSentDialog
  getOraclesReturn: [],
  getTopicsReturn: [],
  allEvents: [],
  error: null, // type: object
});


export default function graphqlReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_TOPICS_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTopicsReturn', action.value);
      }

      // Not first page, add to existing data
      return state.set('getTopicsReturn', [...state.get('getTopicsReturn'), ...action.value]);
    }

    case actions.GET_ORACLES_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getOraclesReturn', action.value);
      }

      // Not first page, add to existing data
      return state.set('getOraclesReturn', [...state.get('getOraclesReturn'), ...action.value]);
    }

    case actions.GET_ALL_EVENTS_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('allEvents', action.value);
      }

      // Not first page, add to existing data
      return state.set('allEvents', [...state.get('allEvents'), ...action.value]);
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
