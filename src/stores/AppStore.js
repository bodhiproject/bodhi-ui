import { observable, runInAction } from 'mobx';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import WalletStore from './WalletStore';
import PubSubStore from './PubSubStore';


class AppStore {
  @observable loading = true;
  @observable sortBy = 'ASC' // might want to move somewhere else
  ui = {} // ui store
  wallet = {} // wallet store
  pubsub = {} // pubsub store
  allEvents = {} // allEvents store

  constructor() {
    this.init();
  }

  async init() {
    this.loading = true;
    this.ui = new UiStore();
    this.wallet = new WalletStore();
    this.pubsub = new PubSubStore(this);
    await this.pubsub.getSyncInfo();
    runInAction(() => {
      this.allEvents = new AllEventsStore(this);
      this.qtumPrediction = new QtumPredictionStore(this);
      this.loading = false;
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
