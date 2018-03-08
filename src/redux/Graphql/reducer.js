import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function graphqlReducer(state = initState, action) {
  // Catch all request errors
  if (action.error) {
    return state.set('requestError', { msg: action.error });
  }

  switch (action.type) {
    case actions.GET_TOPICS_RETURN: {
      return state.set('getTopicsReturn', action.value);
    }
    case actions.GET_ORACLES_RETURN: {
      return state.set('getOraclesReturn', action.value);
    }
    case actions.GET_TRANSACTIONS_RETURN: {
      return state.set('getTransactionsReturn', action.value);
    }
    case actions.CREATE_TOPIC_TX_RETURN:
    case actions.CREATE_BET_TX_RETURN:
    case actions.CREATE_SET_RESULT_TX_RETURN:
    case actions.CREATE_VOTE_TX_RETURN:
    case actions.CREATE_FINALIZE_RESULT_TX_RETURN:
    case actions.CREATE_WITHDRAW_TX_RETURN:
    case actions.CREATE_TRANSFER_TX_RETURN: {
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
