export default class SyncInfo {
  percent = 0
  blockNum = 0
  blockTime = 0

  constructor(syncInfo) {
    this.percent = syncInfo.syncPercent;
    this.blockNum = syncInfo.syncBlockNum;
    this.blockTime = Number(syncInfo.syncBlockTime);
  }
}
