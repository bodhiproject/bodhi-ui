import { observable } from 'mobx';
import { satoshiToDecimal, weiToDecimal } from '../helpers/utility';

export default class WalletAddress {
  @observable address = ''
  @observable naka = 0
  @observable nakaSatoshi = 0
  @observable nbot = 0
  @observable nbotSatoshi = 0

  constructor(args) {
    Object.assign(this, args);
    this.address = this.address;
    this.naka = weiToDecimal(args.naka);
    this.nakaSatoshi = args.naka;
    this.nbot = satoshiToDecimal(args.nbot);
    this.nbotSatoshi = args.nbot;
  }
}
