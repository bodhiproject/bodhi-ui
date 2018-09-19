import { observable, action, runInAction, reaction } from 'mobx';
import axios from 'axios';
import { map } from 'lodash';
import { TransactionType, Token } from 'constants';

import TransactionCost from './models/TransactionCost';
import { WalletProvider } from '../constants';
import networkRoutes from '../network/routes';
import { createApproveTx, createBetTx } from '../network/graphql/mutations';
import getContracts from '../config/contracts';

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
  confirmedFunc: undefined,
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
  confirmedFunc = INIT_VALUES.confirmedFunc;
  app = undefined;

  constructor(app) {
    this.app = app;

    reaction(
      () => this.visible,
      () => {
        if (!this.visible) {
          Object.assign(this, INIT_VALUES);
        }
      }
    );
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
      console.log(fees);

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
  showBetPrompt = async (topicAddress, oracleAddress, option, amount) => {
    this.type = TransactionType.BET;
    this.topicAddress = topicAddress;
    this.oracleAddress = oracleAddress;
    this.option = option;
    this.amount = Number(amount);
    this.token = Token.QTUM;
    this.senderAddress = this.app.wallet.currentAddress;

    if (this.app.global.localWallet) {
      this.confirmedFunc = this.app.eventPage.bet;
    } else {
      this.confirmedFunc = async () => {
        // Execute bet
        const contract = this.app.global.qweb3.Contract(this.oracleAddress, getContracts().CentralizedOracle.abi);
        const { txid, args: { gasLimit, gasPrice } } = await contract.send('bet', {
          methodArgs: [this.option.idx],
          amount: this.amount,
          senderAddress: this.senderAddress,
        });

        // Create pending tx on server
        if (txid) {
          await createBetTx({
            txid,
            gasLimit,
            gasPrice,
            version: 0,
            topicAddress: this.topicAddress,
            oracleAddress: this.oracleAddress,
            optionIdx: this.option.idx,
            amount: this.amount,
            senderAddress: this.senderAddress,
          });
        }
      };
    }

    this.showConfirmDialog();
  }

  @action
  showApproveSetResultPrompt = async (topicAddress, oracleAddress, option, amount) => {
    console.log('show prompt');
    this.type = TransactionType.APPROVE_SET_RESULT;
    this.topicAddress = topicAddress;
    this.oracleAddress = oracleAddress;
    this.option = option;
    this.amount = amount;
    this.token = Token.BOT;
    this.senderAddress = this.app.wallet.currentAddress;

    if (this.app.global.localWallet) {
      this.confirmedFunc = this.app.eventPage.setResult;
    } else {
      this.confirmedFunc = async () => {
        // Execute approve
        const addressManager = getContracts().AddressManager;
        const contract = this.app.global.qweb3.Contract(addressManager.address, addressManager.abi);
        const { txid, args: { gasLimit, gasPrice } } = await contract.send('approve', {
          methodArgs: [this.topicAddress, this.amount],
          senderAddress: this.senderAddress,
        });

        // Create pending tx on server
        if (txid) {
          await createApproveTx({
            txid,
            gasLimit,
            gasPrice,
            type: this.type,
            version: 0,
            topicAddress: this.topicAddress,
            oracleAddress: this.oracleAddress,
            optionIdx: this.option.idx,
            amount: this.amount,
            token: this.token,
            senderAddress: this.senderAddress,
          });
        }
      };
    }

    this.showConfirmDialog();
  }

  @action
  onTxConfirmed = async () => {
    await this.confirmedFunc();
    this.visible = false;
  }
}
