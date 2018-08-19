import { observable, runInAction } from 'mobx';
import { RouterStore } from 'mobx-react-router';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import RefreshingStore from './RefreshingStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from '../scenes/QtumPrediction/store';
import BotCourtStore from './BotCourtStore';
import ResultSettingStore from '../scenes/Activities/ResultSetting/store';
import FinalizeStore from '../scenes/Activities/Finalize/store';
import WithdrawStore from '../scenes/Activities/Withdraw/store';
import ActivityHistoryStore from '../scenes/Activities/ActivityHistory/store';
import WalletStore from './WalletStore';
import GlobalSnackbarStore from '../components/GlobalSnackbar/store';
import WalletUnlockDialogStore from '../components/WalletUnlockDialog/store';
import PendingTxsSnackbarStore from '../components/PendingTxsSnackbar/store';
import CreateEventStore from '../scenes/CreateEvent/store';
import EventPageStore from '../scenes/Event/store';
import WalletHistoryStore from '../scenes/Wallet/History/store';

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
    // block content until all stores are initialized
    this.loading = true;

    this.router = new RouterStore();
    this.global = new GlobalStore(this);
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);
    this.pendingTxsSnackbar = new PendingTxsSnackbarStore(this);
    this.refreshing = new RefreshingStore();
    this.eventPage = new EventPageStore(this);

    runInAction(() => {
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
      this.myWallet = {
        history: new WalletHistoryStore(this),
      };

      // finished loading all stores, show UI
      this.loading = false;
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
