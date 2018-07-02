import { observable, action, runInAction } from 'mobx';

import { querySyncInfo } from '../network/graphQuery';
import SyncInfo from './models/SyncInfo';


export default class GlobalStore {
  @observable syncInfo
  @observable syncPercent = 0
  @observable syncBlockNum
  @observable syncBlockTime = ''

  constructor(app) {
    this.app = app;
  }

  @action
  onSyncInfo = (syncInfoObj) => {
    if (syncInfoObj.error) {
      console.log(syncInfoObj.error.message); // eslint-disable-line no-console
    } else {
      runInAction(() => {
        this.syncInfo = new SyncInfo(syncInfoObj);
        this.app.wallet.addresses = this.syncInfo.balances;
      });
    }
  }

  @action
  getSyncInfo = async () => {
    try {
      const includeBalances = this.syncPercent === 0 || this.syncPercent >= 98;
      const syncInfo = await querySyncInfo(includeBalances);
      this.onSyncInfo(syncInfo);
    } catch (err) {
      this.onSyncInfo({ error: err.message });
    }
  }
}
