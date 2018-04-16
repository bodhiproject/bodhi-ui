import { Map } from 'immutable';
import _ from 'lodash';

import { AppLocation, SortBy } from '../../constants';
import { getDefaultPath } from '../../helpers/urlSync';
import { satoshiToDecimal } from '../../helpers/utility';
import actions, { getView } from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: !(window.innerWidth > 1220),
  view: getView(window.innerWidth),
  height: window.innerHeight,
  current: preKeys,
  appLocation: AppLocation.qtumPrediction,
  walletAddresses: [],
  lastUsedAddress: '',
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: 0,
  walletUnlockDialogVisibility: false,
  walletEncrypted: false,
  walletUnlockedUntil: 0,
  pendingTxsSnackbarVisible: true,
  globalSnackbarVisible: false,
  createEventDialogVisible: false,
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
    case actions.SET_APP_LOCATION: {
      return state.set('appLocation', action.location);
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

      // Sort by qtum balance
      newAddresses = _.orderBy(newAddresses, ['qtum'], [SortBy.Descending.toLowerCase()]);

      // Set a default selected address if there was none selected before
      let lastUsedAddress = state.get('lastUsedAddress');
      if (_.isEmpty(lastUsedAddress) && !_.isEmpty(newAddresses)) {
        lastUsedAddress = newAddresses[0].address;
      }

      return state
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
    case actions.CHECK_WALLET_ENCRYPTED_RETURN: {
      if (action.error) {
        return state.set('errorApp', action.error);
      }
      console.log(action.isEncrypted, action.unlockedUntil);
      return state.set('walletEncrypted', action.isEncrypted)
        .set('walletUnlockedUntil', action.unlockedUntil);
    }
    case actions.UNLOCK_WALLET_RETURN: {
      if (action.error) {
        return state.set('errorApp', action.error);
      }
      return state.set('walletUnlockedUntil', action.unlockedUntil);
    }
    case actions.CLEAR_ERROR_APP: {
      return state.set('errorApp', undefined);
    }
    case actions.TOGGLE_PENDING_TXS_SNACKBAR: {
      return state.set('pendingTxsSnackbarVisible', action.isVisible);
    }
    case actions.TOGGLE_GLOBAL_SNACKBAR: {
      return state.set('globalSnackbarVisible', action.isVisible);
    }
    case actions.TOGGLE_CREATE_EVENT_DIALOG: {
      return state.set('createEventDialogVisible', action.isVisible);
    }
    default: {
      return state;
    }
  }
}
