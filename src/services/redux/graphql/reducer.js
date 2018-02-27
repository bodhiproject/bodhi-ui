import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function graphqlReducer(state = initState, action) {
  switch (action.type) {
    case actions.CREATE_TOPIC_TX_RETURN: {
      return state.set('createdTopic', action.value);
    }
    case actions.CREATE_BET_TX_RETURN:
    case actions.CREATE_SET_RESULT_TX_RETURN:
    case actions.CREATE_VOTE_TX_RETURN:
    case actions.CREATE_FINALIZE_RESULT_TX_RETURN:
    case actions.CREATE_WITHDRAW_TX_RETURN: {
      return state.set('txReturn', action.value);
    }
    default: {
      return state;
    }
  }
}
