import { observable, action, runInAction } from 'mobx';
import { querySyncInfo } from '../network/graphQuery';


export default class PubSubStore {
  @observable syncPercent = 0
  @observable syncBlockNum
  @observable syncBlockTime = ''
  @observable error = ''

  constructor(app) {
    this.app = app;
  }

  @action.bound
  syncInfo({ syncPercent, syncBlockNum, syncBlockTime, addressBalances = [], error }) {
    if (error) {
      this.error = error;
    } else {
      this.syncPercent = syncPercent;
      this.syncBlockNum = syncBlockNum;
      this.syncBlockTime = syncBlockTime;
      this.app.wallet.addresses = addressBalances;
    }
  }

  @action.bound
  async getSyncInfo() {
    try {
      const includeBalances = this.syncPercent === 0 || this.syncPercent >= 98;
      const syncInfo = await querySyncInfo(includeBalances);
      runInAction(() => {
        this.syncInfo(syncInfo);
      });
    } catch (err) {
      this.error = err.message;
    }
  }
}
