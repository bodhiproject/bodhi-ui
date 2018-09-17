import { satoshiToDecimal } from '../../helpers/utility';

export default class WalletAddress {
  address = ''
  qtum = ''
  bot = ''

  constructor(addressBalance) {
    Object.assign(this, addressBalance);
    this.address = this.address;
    this.qtum = satoshiToDecimal(addressBalance.qtum);
    this.bot = satoshiToDecimal(addressBalance.bot);
  }
}
