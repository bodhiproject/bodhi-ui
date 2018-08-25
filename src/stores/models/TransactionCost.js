import { Token } from 'constants';
import { satoshiToDecimal } from '../../helpers/utility';


/*
* Model for TransactionCost.
* Represents the cost for a transaction. This is fetched before the user executes a transaction.
*/
export default class TransactionCost {
  type
  token
  amount
  gasLimit
  gasCost

  constructor(txCost) {
    Object.assign(this, txCost);

    if (this.token === Token.BOT) {
      this.amount = satoshiToDecimal(this.amount);
    }

    // Temp fix to remove amount of approve types for TxConfirmDialog
    if (this.type === 'approve') {
      this.amount = undefined;
    }
  }
}
