import { observable, runInAction } from 'mobx';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import RefreshingStore from './RefreshingStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import BotCourtStore from './BotCourtStore';
import ResultSettingStore from './activitiesStores/ResultSetting';
import FinalizeStore from './activitiesStores/Finalize';
import WithdrawStore from './activitiesStores/Withdraw';
import WalletStore from './wallet/WalletStore';
import GlobalSnackbarStore from './components/GlobalSnackbarStore';
import SelectAddressDialogStore from './components/SelectAddressDialogStore';
import WalletUnlockDialogStore from './components/WalletUnlockDialogStore';
import PendingTransactionsSnackbarStore from './components/PendingTransactionsSnackbarStore';
import NavBarStore from '../components/NavBar/store';

class AppStore {
  @observable loading = true; // TODO: move these to GlobalStore
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  allEvents = {}
  globalSnackbar = {}
  selectAddressDialog = {}
  walletUnlockDialog = {}
  pendingTxsSnackbar = {}

  constructor() {
    this.init();
  }

  async init() {
    this.loading = true;
    this.global = new GlobalStore(this);
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.selectAddressDialog = new SelectAddressDialogStore();
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);
    this.pendingTxsSnackbar = new PendingTransactionsSnackbarStore();
    this.refreshing = new RefreshingStore();
    this.navBar = new NavBarStore();

    await this.global.getSyncInfo(); // Inits the wallet addresses
    runInAction(() => {
      // these store are designed for "components"
      this.allEvents = new AllEventsStore(this);
      this.qtumPrediction = new QtumPredictionStore(this);
      this.botCourt = new BotCourtStore(this);
      this.activities = {
        resultSetting: new ResultSettingStore(this),
        finalize: new FinalizeStore(this),
        withdraw: new WithdrawStore(this),
      };
      this.loading = false; // finish loading
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
