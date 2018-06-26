import { observable, runInAction } from 'mobx';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import BotCourtStore from './BotCourtStore';
import ResultSettingStore from './activitiesStores/ResultSetting';
import FinalizeStore from './activitiesStores/Finalize';
import WithdrawStore from './activitiesStores/Withdraw';
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
    this.wallet = new WalletStore(this);
    this.pubsub = new PubSubStore(this);
    await this.pubsub.getSyncInfo();
    runInAction(() => {
      this.allEvents = new AllEventsStore(this);
      this.qtumPrediction = new QtumPredictionStore(this);
      this.botCourt = new BotCourtStore(this);
      this.activities = {
        resultSetting: new ResultSettingStore(this),
        finalize: new FinalizeStore(this),
        withdraw: new WithdrawStore(this),
      };
      this.loading = false;
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
