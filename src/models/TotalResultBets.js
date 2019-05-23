import { map } from 'lodash';
import { satoshiToDecimal } from '../helpers/utility';

export default class TotalResultBets {
  resultBets // Array of accumulated result bets in decimals
  resultBetsSatoshi // Array of accumulated result bets in satoshi
  betterBets // Array of accumulated better bets in decimals
  betterBetsSatoshi // Array of accumulated better bets in satoshi

  constructor(obj) {
    Object.assign(this, obj);
    this.resultBets = map(obj.resultBets, satoshiToDecimal);
    this.resultBetsSatoshi = obj.resultBets;
    this.betterBets = obj.betterBets && map(obj.betterBets, satoshiToDecimal);
    this.betterBetsSatoshi = obj.betterBets;
  }
}
