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
  walletAddrs: [],
  walletAddrsIndex: 0,
  selectedWalletAddress: '',
  syncProgress: 0,
  initSyncing: false,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.ADD_WALLET_ADDRESS: {
      const addresses = state.get('walletAddrs');
      addresses.push({ address: action.value, qtum: 0 });
      return state.set('walletAddrs', addresses);
    }
    case actions.SELECT_WALLET_ADDRESS: {
      const walletAddrsIndex = action.value;
      const walletAddrs = state.get('walletAddrs');

      if (!_.isEmpty(walletAddrs)
        && walletAddrsIndex < walletAddrs.length
        && !_.isUndefined(walletAddrs[walletAddrsIndex])) {
        const newState = state.set('walletAddrsIndex', walletAddrsIndex);
        return newState.set('selectedWalletAddress', walletAddrs[walletAddrsIndex].address);
      }
      return state;
    }
    case actions.LIST_UNSPENT_RETURN: {
      console.log(action.value);

      let result = [];
      let newState = state;
      let combinedAddresses = [];

      if (action.value.result) {
        result = _.orderBy(_.map(action.value.result, (item) => ({
          address: item.address,
          qtum: item.amount,
        })), ['qtum'], ['desc']);

        // Sum qtum balance of same addresses
        if (!_.isEmpty(result)) {
          _.each(result, (item) => {
            const foundObj = _.find(combinedAddresses, { address: item.address });
            if (foundObj) {
              foundObj.qtum += item.qtum;
            } else {
              combinedAddresses.push({
                address: item.address,
                qtum: item.qtum,
              });
            }
          });

          // Make sure address list is not too long
          combinedAddresses = combinedAddresses.slice(0, WALLET_ADDRESS_MAX_COUNT);
        }
      }

      let existingAddresses = state.get('walletAddrs') || [];

      if (_.isEmpty(existingAddresses)) {
        existingAddresses = combinedAddresses;

        // If initalizing, set initial value for selectedWalletAddress here
        newState = state.set('selectedWalletAddress', result[state.get('walletAddrsIndex')]
          && result[state.get('walletAddrsIndex')].address);
      } else { // Update existing address list if new is different
        _.each(existingAddresses, (item) => {
          const newAddressObj = _.find(combinedAddresses, { address: item.address });
          _.extend(item, newAddressObj);
        });
      }

      return newState.set('walletAddrs', existingAddresses);
    }
    case actions.GET_BOT_BALANCE_RETURN: {
      const walletAddrs = state.get('walletAddrs');

      if (action && action.value) {
        const ownerAddress = action.value.address;
        const ownerBotBalance = action.value.value;

        const ownerObj = _.find(walletAddrs, (item) => item.address === ownerAddress);

        if (ownerObj) {
          ownerObj.bot = ownerBotBalance;
        }
      }

      return state.set('walletAddrs', walletAddrs);
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
