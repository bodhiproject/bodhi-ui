import { Map } from 'immutable';
import _ from 'lodash';
import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();
const WALLET_ADDRESS_MAX_COUNT = 8;

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  walletAddresses: [],
  lastUsedAddress: '',
  syncProgress: 0,
  initSyncing: false,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.ADD_WALLET_ADDRESS: {
      const addresses = state.get('walletAddresses');
      addresses.push({ address: action.value, qtum: 0 });
      return state.set('walletAddresses', addresses);
    }
    case actions.SET_LAST_USED_ADDRESS: {
      return state.set('lastUsedAddress', action.address);
    }
    case actions.LIST_UNSPENT_RETURN: {
      if (action.error) {
        console.error('Error fetching listunspent');
        return state;
      }

      let newAddresses = action.value.addresses;

      // Update the bot balance of the existing addresses or add in existing addresses but with 0 qtum balance.
      // This is for good UX so the user won't wonder why their old address which they did a sendtoaddress
      // is no longer on the list of addresses.
      const existingAddresses = state.get('walletAddresses');
      _.each(existingAddresses, (addressObj) => {
        const index = _.findIndex(newAddresses, { address: addressObj.address });
        if (index !== -1) {
          // Set the bot balance of the old address to the new one
          newAddresses.splice(index, 1, {
            address: addressObj.address,
            qtum: newAddresses[index].qtum,
            bot: addressObj.bot,
          });
        } else {
          // Add the address to the list of new addresses, but with 0 qtum balance since no unspents match it
          newAddresses.push({
            address: addressObj.address,
            qtum: 0,
            bot: addressObj.bot,
          });
        }
      });

      // Sort
      newAddresses = _.orderBy(newAddresses, ['qtum'], ['desc']);

      // Set a default selected address if there was none selected before
      let lastUsedAddress = state.get('lastUsedAddress');
      if (_.isEmpty(lastUsedAddress) && !_.isEmpty(newAddresses)) {
        lastUsedAddress = newAddresses[0].address;
      }

      return state.set('walletAddresses', newAddresses)
        .set('utxos', action.value.utxos)
        .set('lastUsedAddress', lastUsedAddress)
        .set('updatingBalances', true);
    }
    case actions.GET_BOT_BALANCE_RETURN: {
      if (action.error) {
        console.error('Error fetching bot-balance');
        return state;
      }

      const walletAddresses = state.get('walletAddresses');
      const { address, botAmount } = action.value;

      const ownerObj = _.find(walletAddresses, (item) => item.address === address);
      if (ownerObj) {
        ownerObj.bot = botAmount;
      }

      return state.set('walletAddresses', walletAddresses);
    }
    case actions.TOGGLE_ALL: {
      if (state.get('view') !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set('collapsed', action.collapsed)
          .set('view', action.view)
          .set('height', height);
      }
      return state;
    }
    case actions.SYNC_INFO_RETURN: {
      if (action.error) {
        return state.set('syncInfoError', action.error);
      }

      // Sort by qtum balance
      const walletAddresses = _.orderBy(action.syncInfo.addressBalances, ['qtum'], ['desc']);

      // Set a default selected address if there was none selected before
      let lastUsedAddress = state.get('lastUsedAddress');
      if (_.isEmpty(lastUsedAddress) && !_.isEmpty(walletAddresses)) {
        lastUsedAddress = walletAddresses[0].address;
      }

      return state.set('chainBlockNum', action.syncInfo.chainBlockNum)
        .set('syncBlockNum', action.syncInfo.syncBlockNum)
        .set('syncBlockTime', Number(action.syncInfo.syncBlockTime))
        .set('walletAddresses', walletAddresses)
        .set('lastUsedAddress', lastUsedAddress);
    }
    case actions.UPDATE_SYNC_PROGRESS: {
      return state.set('syncProgress', action.percentage);
    }
    case actions.TOGGLE_INITIAL_SYNC: {
      return state.set('initSyncing', action.isSyncing);
    }
    case actions.GET_INSIGHT_TOTALS_RETURN: {
      return state.set('averageBlockTime', action.value.result.time_between_blocks);
    }
    default: {
      return state;
    }
  }
}
