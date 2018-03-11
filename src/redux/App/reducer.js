import { Map } from 'immutable';
import _ from 'lodash';

import { getDefaultPath } from '../../helpers/urlSync';
import { satoshiToDecimal } from '../../helpers/utility';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  walletAddresses: [],
  lastUsedAddress: '',
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: 0,
  initSyncing: false,
  walletUnlockDialogVisibility: false,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
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
    case actions.SET_LAST_USED_ADDRESS: {
      return state.set('lastUsedAddress', action.address);
    }
    case actions.SYNC_INFO_RETURN: {
      if (action.error) {
        return state.set('syncInfoError', action.error);
      }

      // Process address balances to decimals
      let newAddresses = [];
      _.each(action.syncInfo.addressBalances, (addressObj) => {
        newAddresses.push({
          address: addressObj.address,
          qtum: satoshiToDecimal(addressObj.qtum),
          bot: satoshiToDecimal(addressObj.bot),
        });
      });

      // Add old addresses to new list if not found
      const oldAddresses = state.get('walletAddresses');
      _.each(oldAddresses, (addressObj) => {
        const index = _.findIndex(newAddresses, { address: addressObj.address });

        // Old address not found in new address list. Add it to new list.
        if (index === -1) {
          newAddresses.push({
            address: addressObj.address,
            qtum: 0,
            bot: 0,
          });
        }
      });

      // Sort by qtum balance
      newAddresses = _.orderBy(newAddresses, ['qtum'], ['desc']);

      // Set a default selected address if there was none selected before
      let lastUsedAddress = state.get('lastUsedAddress');
      if (_.isEmpty(lastUsedAddress) && !_.isEmpty(newAddresses)) {
        lastUsedAddress = newAddresses[0].address;
      }

      return state.set('initSyncing', action.syncInfo.syncPercent < 100)
        .set('syncPercent', action.syncInfo.syncPercent)
        .set('syncBlockNum', action.syncInfo.syncBlockNum)
        .set('syncBlockTime', Number(action.syncInfo.syncBlockTime))
        .set('walletAddresses', newAddresses)
        .set('lastUsedAddress', lastUsedAddress);
    }
    case actions.GET_INSIGHT_TOTALS_RETURN: {
      return state.set('averageBlockTime', action.value.result.time_between_blocks);
    }
    case actions.TOGGLE_WALLET_UNLOCK_DIALOG: {
      return state.set('walletUnlockDialogVisibility', action.isVisible);
    }
    default: {
      return state;
    }
  }
}
