import { observable } from 'mobx';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import WalletStore from './WalletStore';
import PubSubStore from './PubSubStore';


class AppStore {
  @observable sortBy = 'ASC' // might want to move somewhere else
  ui = {} // ui store
  wallet = {} // wallet store
  pubsub = {} // pubsub store
  allEvents = {} // allEvents store

  constructor() {
    this.ui = new UiStore();
    this.wallet = new WalletStore();
    this.pubsub = new PubSubStore(this);
    this.allEvents = new AllEventsStore(this);
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
