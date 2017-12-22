import { Map } from 'immutable';
import _ from 'lodash';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  walletAddrs: [],
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    /** Wallet Addresses * */
    case actions.ADD_WALLET_ADDRESS:
    {
      const addresses = state.get('walletAddrs');
      addresses.push({ address: action.value, qtum: 0 });
      return state.set('walletAddrs', addresses);
    }
    case actions.SELECT_WALLET_ADDRESS:
      return state.set('walletAddrsIndex', action.value);
    case actions.SELECTED_WALLET_ADDRESS:
    {
      const walletAddrs = state.get('walletAddrs');
      const walletAddrsIndex = state.get('walletAddrsIndex');

      if (!_.isEmpty(walletAddrs) && walletAddrsIndex < walletAddrs.length && !_.isUndefined(walletAddrs[walletAddrsIndex])) {
        return state.get('selected_wallet_address', walletAddrs[walletAddrsIndex].address);
      }

      return state.get('selected_wallet_address', undefined);
    }

    /** List Unspent Return * */
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

    /** Block Count * */
    case actions.GET_BLOCK_COUNT_RETURN:
      return state.set('get_block_count_return', action.value);
    case actions.TOGGLE_ALL:
      if (state.get('view') !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set('collapsed', action.collapsed)
          .set('view', action.view)
          .set('height', height);
      }
      break;

      /** Bot Balance * */
    case actions.GET_BOT_BALANCE_RETURN:
      return state.set('bot_balance', action.value);

    default:
      return state;
  }
  return state;
}
