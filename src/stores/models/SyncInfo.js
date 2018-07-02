import _ from 'lodash';

import { Token, TransactionType } from 'constants';
import { gasToQtum, satoshiToDecimal } from '../../helpers/utility';

export default class SyncInfo {
  syncPercent = 0
  syncBlockNum = 0
  syncBlockTime = ''
  balances = {}

  constructor(syncInfo) {
    Object.assign(this, syncInfo);
    this.gasLimit = Number(this.gasLimit);
    this.gasPrice = Number(this.gasPrice);
    this.fee = gasToQtum(this.gasUsed);

    if (this.token === Token.Bot) {
      const { ApproveCreateEvent, ApproveSetResult, ApproveVote } = TransactionType;
      if (_.includes([ApproveCreateEvent, ApproveSetResult, ApproveVote], this.type)) {
        // Don't show the amount for any approves
        this.amount = undefined;
      } else {
        this.amount = satoshiToDecimal(this.amount);
      }
    }
  }
}
