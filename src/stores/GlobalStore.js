import { observable, action } from 'mobx';

import { querySyncInfo } from '../network/graphQuery';
import SyncInfo from './models/SyncInfo';


export default class GlobalStore {
  @observable syncPercent = 0
  @observable syncBlockNum = 0
  @observable syncBlockTime = ''
  @observable peerNodeCount = 1

  constructor(app) {
    this.app = app;
  }

  @action
  getSyncInfo = async () => {
    try {
      const includeBalances = this.syncPercent === 0 || this.syncPercent >= 98;
      const syncInfo = await querySyncInfo(includeBalances);
      this.onSyncInfo(syncInfo);
    } catch (error) {
      this.onSyncInfo({ error });
    }
  }

  @action
  onSyncInfo = (syncInfo) => {
    if (syncInfo.error) {
      console.error(syncInfo.error.message); // eslint-disable-line no-console
    } else {
      const { percent, blockNum, blockTime, balances, peerNodeCount } = new SyncInfo(syncInfo);
      this.syncPercent = percent;
      this.syncBlockNum = blockNum;
      this.syncBlockTime = blockTime;
      this.peerNodeCount = peerNodeCount || 1;
      this.app.wallet.addresses = balances;
    }
  }
}
