import { map } from 'lodash';
import { satoshiToDecimal } from '../helpers/utility';

export default class TotalResultBets {
  totalBets // Array of accumulated result bets in decimals
  totalBetsSatoshi // Array of accumulated result bets in satoshi
  betterBets // Array of accumulated better bets in decimals
  betterBetsSatoshi // Array of accumulated better bets in satoshi
  totalVotes // Array of accumulated round 0 result bets in decimals
  totalVotesSatoshi // Array of accumulated round 0 result bets in satoshi
  betterVotes // Array of accumulated better round 0 result bets in decimals
  betterVotesSatoshi // Array of accumulated better round 0 result bets in satoshi

  constructor(obj) {
    Object.assign(this, obj);
    this.totalBets = map(obj.totalBets, satoshiToDecimal);
    this.totalBetsSatoshi = obj.totalBets;
    this.betterBets = obj.betterBets && map(obj.betterBets, satoshiToDecimal);
    this.betterBetsSatoshi = obj.betterBets;
    this.totalVotes = map(obj.totalVotes, satoshiToDecimal);
    this.totalVotesSatoshi = obj.totalVotes;
    this.betterVotes = map(obj.betterVotes, satoshiToDecimal);
    this.betterVotesSatoshi = obj.betterVotes;
  }
}
