import { observable, runInAction } from 'mobx';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import ResultSettingStore from './activitiesStores/ResultSetting';
import FinalizeStore from './activitiesStores/Finalize';
import WithdrawStore from './activitiesStores/Withdraw';
import WalletStore from './WalletStore';
import WalletHistoryStore from './WalletHistoryStore';
import GlobalSnackbarStore from './components/GlobalSnackbarStore';
import WalletUnlockDialogStore from './components/WalletUnlockDialogStore';

class AppStore {
  @observable loading = true; // TODO: move these to GlobalStore
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  walletHistory = {}
  allEvents = {}
  globalSnackbar = {}
  walletUnlockDialog = {}

  constructor() {
    this.init();
  }

  async init() {
    this.loading = true;
    this.global = new GlobalStore(this);
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.walletHistory = new WalletHistoryStore();
    this.globalSnackbar = new GlobalSnackbarStore();
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);

    await this.global.getSyncInfo(); // Inits the wallet addresses
    runInAction(() => {
      this.allEvents = new AllEventsStore(this);
      this.qtumPrediction = new QtumPredictionStore(this);
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
