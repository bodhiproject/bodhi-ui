export default class SyncInfo {
  percent // Percentage of backend that is synced to the latest block
  blockNum // Block number of the latest synced block
  blockTime // Block time of the latest synced block

  constructor(syncInfo) {
    this.percent = syncInfo.syncPercent;
    this.blockNum = syncInfo.syncBlockNum;
    this.blockTime = syncInfo.syncBlockTime;
  }
}
