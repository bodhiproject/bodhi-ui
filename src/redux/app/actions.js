export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}

const actions = {
  TOGGLE_ALL: 'TOGGLE_ALL',
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },

  ADD_WALLET_ADDRESS: 'ADD_WALLET_ADDRESS',
  SELECT_WALLET_ADDRESS: 'SELECT_WALLET_ADDRESS',
  addWalletAddress: (value) => ({
    type: actions.ADD_WALLET_ADDRESS,
    value,
  }),
  selectWalletAddress: (value) => ({
    type: actions.SELECT_WALLET_ADDRESS,
    value,
  }),

  LIST_UNSPENT: 'LIST_UNSPENT',
  LIST_UNSPENT_RESULT: 'LIST_UNSPENT_RESULT',
  listUnspent: () => ({
    type: actions.LIST_UNSPENT,
  }),

  GET_BLOCK_COUNT: 'GET_BLOCK_COUNT',
  GET_BLOCK_COUNT_RETURN: 'GET_BLOCK_COUNT_RETURN',
  getBlockCount: () => ({
    type: actions.GET_BLOCK_COUNT,
  }),

  GET_BOT_BALANCE: 'GET_BOT_BALANCE',
  GET_BOT_BALANCE_RETURN: 'GET_BOT_BALANCE_RETURN',
  getBotBalance: (owner, senderAddress) => ({
    type: actions.GET_BOT_BALANCE,
    payload: {
      owner,
      senderAddress,
    },
  }),

  GET_SYNC_INFO: 'GET_SYNC_INFO',
  GET_SYNC_INFO_RETURN: 'GET_SYNC_INFO_RETURN',
  getSyncInfo: () => ({
    type: actions.GET_SYNC_INFO,
  }),
};
export default actions;
