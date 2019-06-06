import { map } from 'lodash';
import { satoshiToDecimal } from '../helpers/utility';

export default class TotalResultBets {
  resultBets // Array of accumulated result bets in decimals
  resultBetsSatoshi // Array of accumulated result bets in satoshi
  betterBets // Array of accumulated better bets in decimals
  betterBetsSatoshi // Array of accumulated better bets in satoshi
  totalRound0Bets // Array of accumulated round 0 result bets in decimals
  totalRound0BetsSatoshi // Array of accumulated round 0 result bets in satoshi
  betterRound0Bets // Array of accumulated better round 0 result bets in decimals
  betterRound0BetsSatoshi // Array of accumulated better round 0 result bets in satoshi

  constructor(obj) {
    Object.assign(this, obj);
    this.resultBets = map(obj.resultBets, satoshiToDecimal);
    this.resultBetsSatoshi = obj.resultBets;
    this.betterBets = obj.betterBets && map(obj.betterBets, satoshiToDecimal);
    this.betterBetsSatoshi = obj.betterBets;
    this.totalRound0Bets = map(obj.totalRound0Bets, satoshiToDecimal);
    this.totalRound0BetsSatoshi = obj.totalRound0Bets;
    this.betterRound0Bets = map(obj.betterRound0Bets, satoshiToDecimal);
    this.betterRound0BetsSatoshi = obj.betterRound0Bets;
  }
}
