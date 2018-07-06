import { Map } from 'immutable';
import _ from 'lodash';
import { SortBy } from 'constants';

import { getDefaultPath } from '../../helpers/urlSync';
import { satoshiToDecimal } from '../../helpers/utility';
import actions from './actions';

const preKeys = getDefaultPath();

const initState = new Map({
  current: preKeys,
  walletAddresses: [],
  lastUsedAddress: '',
  changePassphraseResult: undefined,
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: 0,
  createEventDialogVisible: false,
  txConfirmInfoAndCallback: {},
  addressValidated: false,
  transactionCost: [],
  errorApp: null,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
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
      return state.set('averageBlockTime', action.timeBetweenBlocks);
    }
    case actions.CHANGE_PASSPHRASE_RETURN: {
      if (action.error) {
        return state.set('changePassphraseResult', action.error);
      }
      return state.set('changePassphraseResult', action.changePassphraseResult);
    }
    case actions.IMPORT_WALLET_RETURN: {
      if (action.error) return state.set('errorApp', action.error);
      return state;
    }
    case actions.VALIDATE_ADDRESS_RETURN: {
      if (action.error) {
        return state.set('errorApp', action.error);
      }
      return state.set('addressValidated', action.value);
    }
    case actions.GET_TRANSACTION_COST_RETURN: {
      if (action.error) {
        return state.set('errorApp', action.error);
      }
      return state.set('transactionCost', action.value);
    }
    case actions.CLEAR_ERROR_APP: {
      return state.set('errorApp', null);
    }
    case actions.TOGGLE_CREATE_EVENT_DIALOG: {
      return state.set('createEventDialogVisible', action.isVisible);
    }
    case actions.SET_TX_CONFIRM_INFO_AND_CALLBACK: {
      return state.set('txConfirmInfoAndCallback', {
        txDesc: action.txDesc,
        txAmount: action.txAmount,
        txToken: action.txToken,
        txInfo: action.txInfo,
        confirmCallback: action.confirmCallback,
      });
    }
    case actions.CLEAR_TX_CONFIRM: {
      return state.set('txConfirmInfoAndCallback', {}).set('transactionCost', []);
    }
    case actions.CLEAR_ENCRYPT_RESULT: {
      return state.set('encryptResult', undefined);
    }
    case actions.CLEAR_CHANGE_PASSPHRASE_RESULT: {
      return state.set('changePassphraseResult', undefined);
    }
    default: {
      return state;
    }
  }
}
