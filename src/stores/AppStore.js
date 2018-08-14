import { observable, runInAction, action } from 'mobx';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import RefreshingStore from './RefreshingStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import BotCourtStore from './BotCourtStore';
import ResultSettingStore from './activitiesStores/ResultSetting';
import FinalizeStore from './activitiesStores/Finalize';
import WithdrawStore from './activitiesStores/Withdraw';
import ActivityHistoryStore from './activitiesStores/ActivityHistoryStore';
import WalletStore from './wallet/WalletStore';
import GlobalSnackbarStore from '../components/GlobalSnackbar/store';
import WalletUnlockDialogStore from '../components/WalletUnlockDialog/store';
import PendingTxsSnackbarStore from '../components/PendingTxsSnackbar/store';
import CreateEventStore from '../scenes/CreateEvent/store';
import EventPageStore from '../scenes/Event/store';

class AppStore {
  @observable loading = true;
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  globalSnackbar = {}
  walletUnlockDialog = {}
  pendingTxsSnackbar = {}
  refreshing = {}
  eventPage = {}
  qtumPrediction = {}
  botCourt = {}
  createEvent = {}
  allEvents = {}
  activities = {}

  constructor() {
    this.init();
  }

  @action
  async init() {
    this.loading = true;

    this.global = new GlobalStore(this);
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);
    this.pendingTxsSnackbar = new PendingTxsSnackbarStore(this);
    this.refreshing = new RefreshingStore();
    this.eventPage = new EventPageStore(this);

    runInAction(() => {
      // these store are designed for "components"
      this.qtumPrediction = new QtumPredictionStore(this);
      this.botCourt = new BotCourtStore(this);
      this.createEvent = new CreateEventStore(this);
      this.allEvents = new AllEventsStore(this);
      this.activities = {
        resultSetting: new ResultSettingStore(this),
        finalize: new FinalizeStore(this),
        withdraw: new WithdrawStore(this),
        history: new ActivityHistoryStore(this),
      };

      this.loading = false; // finishing loading
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
