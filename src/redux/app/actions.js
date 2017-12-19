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
  CHANGE_CURRENT: 'CHANGE_CURRENT',
  ADD_WALLET_ADDRESS: 'ADD_WALLET_ADDRESS',
  SELECT_WALLET_ADDRESS: 'SELECT_WALLET_ADDRESS',
  LIST_UNSPENT: 'LIST_UNSPENT',
  LIST_UNSPENT_RESULT: 'LIST_UNSPENT_RESULT',
  GET_BLOCK_COUNT: 'GET_BLOCK_COUNT',
  GET_BLOCK_COUNT_RETURN: 'GET_BLOCK_COUNT_RETURN',
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
  changeCurrent: (current) => ({
    type: actions.CHANGE_CURRENT,
    current,
  }),
  addWalletAddress: (value) => {
    console.log(`actions: ${value}`);
    return {
      type: actions.ADD_WALLET_ADDRESS,
      value,
    };
  },
  selectWalletAddress: (value) => {
    console.log(`selectWalletAddress actions: ${value}`);

    return {
      type: actions.SELECT_WALLET_ADDRESS,
      value,
    };
  },
  listUnspent: () => ({
    type: actions.LIST_UNSPENT,
  }),
  getBlockCount: () => ({
    type: actions.GET_BLOCK_COUNT,
  }),
};
export default actions;
