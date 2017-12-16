import { Map } from 'immutable';
import _ from 'lodash';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  openKeys: preKeys,
  current: preKeys,
  walletAddrs: [],
});

export default function appReducer(state = initState, action) {
  console.log('appReducer', action);
  switch (action.type) {
    case actions.ADD_WALLET_ADDRESS:
      state.get('walletAddrs').push(action.value);
      return state.set('walletAddrs', state.get('walletAddrs'));
    case actions.SELECT_WALLET_ADDRESS:
      return state.set('walletAddrsIndex', action.value);
    case actions.LIST_UNSPENT_RESULT:
    {
      let result = [];

      if (action.value.result) {
        result = _.orderBy(_.map(action.value.result, (item) => ({
          address: item.address,
          qtum: item.amount,
        })), ['qtum'], ['desc']);
      }

      return state.set('walletAddrs', result);
    }
    case actions.COLLPSE_OPEN_DRAWER:
      return state.set('openDrawer', !state.get('openDrawer'));
    case actions.TOGGLE_ALL:
      if (state.get('view') !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set('collapsed', action.collapsed)
          .set('view', action.view)
          .set('height', height);
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return state.set('openKeys', action.openKeys);
    case actions.CHANGE_CURRENT:
      return state.set('current', action.current);
    default:
      return state;
  }
  return state;
}
