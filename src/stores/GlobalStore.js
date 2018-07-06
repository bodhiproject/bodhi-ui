import { observable, action, runInAction } from 'mobx';

import { querySyncInfo } from '../network/graphQuery';
import SyncInfo from './models/SyncInfo';


export default class GlobalStore {
  @observable syncPercent = 0
  @observable syncBlockNum = 0
  @observable syncBlockTime = ''

  constructor(app) {
    this.app = app;
  }

  @action
  onSyncInfo = (syncInfo) => {
    if (syncInfo.error) {
      console.log(syncInfo.error.message); // eslint-disable-line no-console
    } else {
      const { percent, blockNum, blockTime, balances } = new SyncInfo(syncInfo);
      runInAction(() => {
        this.syncPercent = percent;
        this.syncBlockNum = blockNum;
        this.syncBlockTime = blockTime;
        this.app.wallet.addresses = balances;
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
