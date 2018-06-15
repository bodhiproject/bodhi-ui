import { observable } from 'mobx';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import WalletStore from './WalletStore';


class AppStore {
  @observable sortBy = 'ASC' // might want to move somewhere else
  wallet = {} // wallet store
  ui = {} // ui store
  allEvents = {} // allEvents store

  constructor() {
    this.ui = new UiStore();
    this.wallet = new WalletStore();
    this.allEvents = new AllEventsStore(this);
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}
export default store;
