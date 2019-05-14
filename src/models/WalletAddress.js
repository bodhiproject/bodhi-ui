import { observable } from 'mobx';
import { satoshiToDecimal } from '../helpers/utility';

export default class WalletAddress {
  @observable address = ''
  @observable naka = 0
  @observable nbot = 0

  constructor(args, convertToDecimal = true) {
    Object.assign(this, args);
    this.address = this.address;
    this.naka = convertToDecimal ? satoshiToDecimal(args.naka) : args.naka;
    this.nbot = convertToDecimal ? satoshiToDecimal(args.nbot) : args.nbot;
  }
}
