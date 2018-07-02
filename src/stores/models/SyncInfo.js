import _ from 'lodash';

import AddressBalance from './AddressBalance';
import { SortBy } from '../../constants';


export default class SyncInfo {
  percent = 0
  blockNum = 0
  blockTime = ''
  balances = []

  constructor(syncInfo) {
    Object.assign(this, syncInfo);
    this.percent = syncInfo.syncPercent;
    this.blockNum = syncInfo.syncBlockNum;
    this.blockTime = Number(syncInfo.syncBlockTime);
    this.balances = _.map(syncInfo.addressBalances, (addressBalance) => new AddressBalance(addressBalance));

    // Sort by qtum balance
    this.balances = _.orderBy(this.balances, ['qtum'], [SortBy.Descending.toLowerCase()]);
  }
}
