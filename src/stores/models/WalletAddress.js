
import { observable } from 'mobx';
import { satoshiToDecimal } from '../../helpers/utility';

export default class WalletAddress {
  @observable address = ''
  @observable qtum = 0
  @observable bot = 0

  constructor(args, convertToDecimal = true) {
    Object.assign(this, args);
    this.address = this.address;
    this.qtum = convertToDecimal ? satoshiToDecimal(args.qtum) : args.qtum;
    this.bot = convertToDecimal ? satoshiToDecimal(args.bot) : args.bot;
  }
}
