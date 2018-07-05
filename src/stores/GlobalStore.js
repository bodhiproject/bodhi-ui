import { observable, action, runInAction } from 'mobx';

import { querySyncInfo } from '../network/graphQuery';
import SyncInfo from './models/SyncInfo';


export default class GlobalStore {
  @observable syncPercent = 0
  @observable syncBlockNum = 0
  @observable syncBlockTime = ''
  @observable peerNodeCount = 0

  constructor(app) {
    this.app = app;
  }

  @action
  onSyncInfo = (syncInfo) => {
    if (syncInfo.error) {
      console.log(syncInfo.error.message); // eslint-disable-line no-console
    } else {
<<<<<<< HEAD
      const { percent, blockNum, blockTime, balances, peerNodeCount } = new SyncInfo(syncInfo);
=======
      const { percent, blockNum, blockTime, peerNodeCount, balances } = new SyncInfo(syncInfo);
>>>>>>> update parser schema of graphQL
      runInAction(() => {
        this.syncPercent = percent;
        this.syncBlockNum = blockNum;
        this.syncBlockTime = blockTime;
<<<<<<< HEAD
        this.peerNodeCount = peerNodeCount;
=======
        this.peerNodeCount = peerNodeCount + 1;
>>>>>>> update parser schema of graphQL
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
