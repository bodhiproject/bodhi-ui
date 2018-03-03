import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  type: 'toggled',
  value: false,
});

export default function stateReducer(state = initState, action) {
  switch (action.type) {
    case actions.EDITING_TOGGLED: {
      return state.set('toggled', true);
    }
    case actions.CLEAR_EDITING_TOGGLED: {
      return state.set('toggled', false);
    }
    default: {
      return state;
    }
  }
}
