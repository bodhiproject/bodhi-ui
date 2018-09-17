import _ from 'lodash';

import WalletAddress from './WalletAddress';
import { SortBy } from '../../constants';


export default class SyncInfo {
  percent = 0
  blockNum = 0
  blockTime = ''
  balances = []
  peerNodeCount = 0

  constructor(syncInfo) {
    Object.assign(this, syncInfo);
    this.percent = syncInfo.syncPercent;
    this.blockNum = syncInfo.syncBlockNum;
    this.blockTime = Number(syncInfo.syncBlockTime);
    this.peerCount = Number(syncInfo.peerNodeCount);
    const balances = _.map(syncInfo.addressBalances, (addressBalance) => new WalletAddress(addressBalance));

    // Sort by qtum balance
    this.balances = _.orderBy(balances, ['qtum'], [SortBy.DESCENDING.toLowerCase()]);
  }
}
