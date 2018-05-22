/* eslint-disable */
import actions from './actions';
import { EventStatus } from '../../constants';

const initState = {
  getPendingTransactionsReturn: { count: 0 },
  actionableItemCount: {
    [EventStatus.Set]: 0,
    [EventStatus.Finalize]: 0,
    [EventStatus.Withdraw]: 0,
    totalCount: 0,
  },
  // getTopicsReturn: {
  //   data: [],
  //   limit: 50,
  //   skip: 0,
  // },
  // getOraclesReturn: {
  //   data: [],
  //   limit: 50,
  //   skip: 0,
  // },
  // getTransactionsReturn: [],
  // txReturn: {},
};

export default function graphqlReducer(state = initState, action) {
  const { limit, skip, value, error } = action;
  switch (action.type) {
    case actions.GET_TOPICS_RETURN:
      // First page, overwrite all data, otherwise update it
      const data = !skip ? value : [...state.getTopicsReturn.data, ...value];
      return { ...state, getTopicsReturn: { data, limit, skip } };


    case actions.GET_ORACLES_RETURN: {
      // First page, overwrite all data, otherwise update it
      const data = !skip ? value : [...state.getOraclesReturn.data, ...value];
      return { ...state, getOraclesReturn: { data, limit, skip } };
    }

    case actions.GET_TRANSACTIONS_RETURN: {
      // First page, overwrite all data
      const getTransactionsReturn = !skip ? value : [...state.getTransactionsReturn, ...value];
      return { ...state, getTransactionsReturn };
    }

    case actions.GET_PENDING_TRANSACTIONS_RETURN:
      return { ...state, getPendingTransactionsReturn: value };

    case actions.GET_ACTIONABLE_ITEM_COUNT_RETURN:
      return { ...state, actionableItemCount: value };

    case actions.CREATE_TOPIC_TX_RETURN:
    case actions.CREATE_BET_TX_RETURN:
    case actions.CREATE_SET_RESULT_TX_RETURN:
    case actions.CREATE_VOTE_TX_RETURN:
    case actions.CREATE_FINALIZE_RESULT_TX_RETURN:
    case actions.CREATE_WITHDRAW_TX_RETURN:
    case actions.CREATE_TRANSFER_TX_RETURN: {
      const txReturn = error ? { ...(state.txReturn || {}), error } : value;
      console.log('txReturn: ', txReturn);
      return { ...state, txReturn };
    }

    case actions.CLEAR_TX_RETURN:
      return { ...state, txReturn: undefined };

    default:
      return state;
  }
}
