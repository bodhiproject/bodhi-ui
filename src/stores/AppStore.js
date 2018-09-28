import { observable, runInAction } from 'mobx';
import { RouterStore } from 'mobx-react-router';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import RefreshingStore from './RefreshingStore';
import WalletStore from './WalletStore';
import TransactionStore from './TransactionStore';
import AllEventsStore from './AllEventsStore';
import BotCourtStore from './BotCourtStore';
import QtumPredictionStore from '../scenes/QtumPrediction/store';
import ResultSettingStore from '../scenes/Activities/ResultSetting/store';
import FinalizeStore from '../scenes/Activities/Finalize/store';
import WithdrawStore from '../scenes/Activities/Withdraw/store';
import ActivityHistoryStore from '../scenes/Activities/ActivityHistory/store';
import CreateEventStore from '../scenes/CreateEvent/store';
import EventPageStore from '../scenes/Event/store';
import WalletHistoryStore from '../scenes/Wallet/History/store';
import SearchStore from '../scenes/Search/store';
import GlobalSnackbarStore from '../components/GlobalSnackbar/store';
import GlobalDialogStore from '../components/GlobalDialog/store';
import WalletUnlockDialogStore from '../components/WalletUnlockDialog/store';
import PendingTxsSnackbarStore from '../components/PendingTxsSnackbar/store';
import TxSentDialogStore from '../components/TxSentDialog/store';
import InstallQryptoPromptStore from '../components/InstallQryptoPrompt/store';
import { isProduction } from '../config/app';

class AppStore {
  @observable loading = true;
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  transaction = {}
  globalSnackbar = {}
  pendingTxsSnackbar = {}
  globalDialog = {}
  walletUnlockDialog = {}
  txSentDialog = {}
  refreshing = {}
  eventPage = {}
  qtumPrediction = {}
  botCourt = {}
  createEvent = {}
  allEvents = {}
  activities = {}
  search = {}
  components = {}
  installQryptoPrompt = {}

  constructor() {
    // block content until all stores are initialized
    this.loading = true;

    this.router = new RouterStore();
    this.global = new GlobalStore(this);
    this.ui = new UiStore(this);
    this.wallet = new WalletStore(this);
    this.tx = new TransactionStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.pendingTxsSnackbar = new PendingTxsSnackbarStore(this);
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);
    this.txSentDialog = new TxSentDialogStore();
    this.refreshing = new RefreshingStore();
    this.eventPage = new EventPageStore(this);
    this.installQryptoPrompt = new InstallQryptoPromptStore();

    this.components = {
      globalDialog: new GlobalDialogStore(),
    };

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

      this.search = new SearchStore(this);
      // finished loading all stores, show UI
      this.loading = false;
    });
  }
}

const store = new AppStore();
// Add store to window
if (!isProduction()) {
  window.store = store;
}

export default store;
