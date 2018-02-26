import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  value: undefined,
});

export default function graphqlReducer(state = initState, action) {
  switch (action.type) {
    case actions.CREATE_TOPIC_RETURN: {
      console.log('createdTopic', action);
      return state.set('createdTopic', action.value);
    }
    case actions.CREATE_BET_RETURN: {
      return state.set('txReturn', action.value);
    }
    default: {
      return state;
    }
  }
}
