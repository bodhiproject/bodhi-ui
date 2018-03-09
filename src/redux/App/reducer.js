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
  walletAddrsIndex: 0,
  selectedWalletAddress: '',
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
    case actions.SELECT_WALLET_ADDRESS: {
      const walletAddrsIndex = action.value;
      const walletAddresses = state.get('walletAddresses');

      if (!_.isEmpty(walletAddresses)
        && walletAddrsIndex < walletAddresses.length
        && !_.isUndefined(walletAddresses[walletAddrsIndex])) {
        const newState = state.set('walletAddrsIndex', walletAddrsIndex);
        return newState.set('selectedWalletAddress', walletAddresses[walletAddrsIndex].address);
      }
      return state;
    }
    case actions.LIST_UNSPENT_RETURN: {
      const newAddresses = action.value.addresses;

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

      return newState.set('walletAddresses', newAddresses).set('utxos', action.value.utxos);

      // if (_.isEmpty(existingAddresses)) {
      //   existingAddresses = combinedAddresses;

      //   // If initalizing, set initial value for selectedWalletAddress here
      //   newState = state.set('selectedWalletAddress', result[state.get('walletAddrsIndex')]
      //     && result[state.get('walletAddrsIndex')].address);
      // } else { // Update existing address list if new is different
      //   _.each(existingAddresses, (item) => {
      //     const newAddressObj = _.find(combinedAddresses, { address: item.address });
      //     _.extend(item, newAddressObj);
      //   });
      // }

      // return newState.set('walletAddrs', existingAddresses);
    }
    case actions.GET_BOT_BALANCE_RETURN: {
      const walletAddresses = state.get('walletAddresses');

      if (action && action.value) {
        const ownerAddress = action.value.address;
        const ownerBotBalance = action.value.value;

        const ownerObj = _.find(walletAddresses, (item) => item.address === ownerAddress);

        if (ownerObj) {
          ownerObj.bot = ownerBotBalance;
        }
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
      return state.set('chainBlockNum', action.syncInfo.chainBlockNum)
        .set('syncBlockNum', action.syncInfo.syncBlockNum)
        .set('syncBlockTime', Number(action.syncInfo.syncBlockTime));
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
