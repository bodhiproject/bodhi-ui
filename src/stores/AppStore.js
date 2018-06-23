import { observable, runInAction } from 'mobx';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import WalletStore from './WalletStore';
import WalletHistoryStore from './WalletHistoryStore';
import PubSubStore from './PubSubStore';


class AppStore {
  @observable loading = true;
  @observable sortBy = 'ASC' // might want to move somewhere else
  ui = {} // ui store
  wallet = {} // wallet store
  walletHistory = {} // walletHistory store
  pubsub = {} // pubsub store
  allEvents = {} // allEvents store

  constructor() {
    this.init();
  }

  async init() {
    this.loading = true;
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.walletHistory = new WalletHistoryStore();
    this.pubsub = new PubSubStore(this);

    // Stores below need info from syncInfo
    // TODO: Change this GraphQL syncInfo call?
    await this.pubsub.getSyncInfo();
    this.allEvents = new AllEventsStore(this);
    this.qtumPrediction = new QtumPredictionStore(this);
    this.loading = false;
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
