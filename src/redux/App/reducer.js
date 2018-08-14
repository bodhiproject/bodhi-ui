import { Map } from 'immutable';

import { getDefaultPath } from '../../helpers/urlSync';
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
    case actions.GET_INSIGHT_TOTALS_RETURN: {
      return state.set('averageBlockTime', action.timeBetweenBlocks);
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
    default: {
      return state;
    }
  }
}
