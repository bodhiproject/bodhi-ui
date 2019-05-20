import { observable, runInAction } from 'mobx';
import { RouterStore } from 'mobx-react-router';
import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import RefreshingStore from './RefreshingStore';
import NakaStore from './NakaStore';
import WalletStore from './WalletStore';
import TransactionStore from './TransactionStore';
import AllEventsStore from './AllEventsStore';
import ArbitrationStore from '../scenes/Arbitration/store';
import PredictionStore from '../scenes/Prediction/store';
import ResultSettingStore from '../scenes/Activities/ResultSetting/store';
import WithdrawStore from '../scenes/Activities/Withdraw/store';
import ActivityHistoryStore from '../scenes/Activities/ActivityHistory/store';
import CreateEventStore from '../scenes/CreateEvent/store';
import EventPageStore from '../scenes/Event/store';
import LeaderboardStore from '../scenes/Leaderboard/store';
import SearchStore from '../scenes/Search/store';
import GlobalSnackbarStore from '../components/GlobalSnackbar/store';
import GlobalDialogStore from '../components/GlobalDialog/store';
import TxSentDialogStore from '../components/TxSentDialog/store';
import FavoriteStore from '../components/FavoriteDrawer/store';

class AppStore {
  @observable graphqlClient = undefined;
  @observable loading = true;
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  transaction = {}
  favorite = {}
  globalSnackbar = {}
  globalDialog = {}
  txSentDialog = {}
  refreshing = {}
  eventPage = {}
  prediction = {}
  arbitration = {}
  createEvent = {}
  allEvents = {}
  activities = {}
  search = {}
  components = {}

  constructor(graphqlClient) {
    this.graphqlClient = graphqlClient;

    // block content until all stores are initialized
    this.loading = true;

    this.router = new RouterStore();
    this.global = new GlobalStore(this);
    this.ui = new UiStore(this);
    this.naka = new NakaStore(this);
    this.wallet = new WalletStore(this);
    this.tx = new TransactionStore(this);
    this.favorite = new FavoriteStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.txSentDialog = new TxSentDialogStore();
    this.refreshing = new RefreshingStore();
    this.eventPage = new EventPageStore(this);
    window.onload = () => {
      this.naka.init();
    };
    this.components = {
      globalDialog: new GlobalDialogStore(),
    };

    runInAction(() => {
      this.prediction = new PredictionStore(this);
      this.arbitration = new ArbitrationStore(this);
      this.createEvent = new CreateEventStore(this);
      this.allEvents = new AllEventsStore(this);
      this.leaderboard = new LeaderboardStore(this);
      this.activities = {
        resultSetting: new ResultSettingStore(this),
        withdraw: new WithdrawStore(this),
        history: new ActivityHistoryStore(this),
      };
      this.search = new SearchStore(this);
      // finished loading all stores, show UI
      this.loading = false;
    });
  }
}

export default (graphqlClient) => new AppStore(graphqlClient);
