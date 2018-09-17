import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import { map } from 'lodash';
import { TransactionType, Token } from 'constants';

import TransactionCost from './models/TransactionCost';
import { WalletProvider } from '../constants';
import networkRoutes from '../network/routes';

const INIT_VALUES = {
  visible: false,
  provider: WalletProvider.QRYPTO,
  type: undefined,
  action: undefined,
  option: undefined,
  amount: undefined,
  token: undefined,
  topicAddress: undefined,
  oracleAddress: undefined,
  senderAddress: undefined,
  fees: [],
};

export default class TransactionStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
  @observable type = INIT_VALUES.type;
  @observable action = INIT_VALUES.action;
  @observable option = INIT_VALUES.option;
  @observable amount = INIT_VALUES.amount;
  @observable token = INIT_VALUES.token;
  @observable topicAddress = INIT_VALUES.topicAddress;
  @observable oracleAddress = INIT_VALUES.oracleAddress;
  @observable senderAddress = INIT_VALUES.senderAddress;
  @observable fees = INIT_VALUES.fees;
  app = undefined;

  constructor(app) {
    this.app = app;
  }

  @action
  showConfirmDialog = async () => {
    try {
      const { data } = await axios.post(networkRoutes.api.transactionCost, {
        type: this.type,
        token: this.token,
        amount: this.amount,
        optionIdx: this.option.idx,
        topicAddress: this.topicAddress,
        oracleAddress: this.oracleAddress,
        senderAddress: this.app.wallet.currentAddress,
      });
      const fees = map(data, (item) => new TransactionCost(item));

      runInAction(() => {
        this.visible = true;
        this.fees = fees;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.transactionCost);
      });
    }
  }

  @action
  getBetFees = async (amount, option, topicAddress, oracleAddress) => {
    this.type = TransactionType.BET;
    this.token = Token.QTUM;
    this.amount = Number(amount);
    this.option = option;
    this.topicAddress = topicAddress;
    this.oracleAddress = oracleAddress;
    this.senderAddress = this.app.wallet.currentAddress;
    this.showConfirmDialog();
  }
}
