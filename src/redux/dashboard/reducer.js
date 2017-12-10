import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  type: 'get_topics',
  success: true,
  value: undefined,
});

export default function authReducer(
  state = initState,
  action
) {
  switch (action.type) {
    case actions.GET_TOPICS_SUCCESS:
      return state.set('success', true).set('value', action.value);
    case actions.GET_TOPICS_ERROR:
      return state.set('success', false).set('value', action.value);
    case actions.GET_ORACLES_SUCCESS:
      return state.set('allOraclesSuccess', true).set('allOraclesValue', action.value);
    case actions.GET_ORACLES_ERROR:
      return state.set('allOraclesSuccess', false).set('allOraclesValue', action.value);
    default:
      return state;
  }
}
