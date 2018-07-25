import { observable, action, runInAction, reaction, computed } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { TransactionType, Token } from 'constants';

import WalletHistoryStore from './WalletHistoryStore';
import axios from '../../network/httpRequest';
import Routes from '../../network/routes';
import { createTransferTx } from '../../network/graphMutation';
import Transaction from '../models/Transaction';
import { decimalToSatoshi } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';


export default class {
  @observable addresses = []
  @observable lastUsedAddress = ''
  @observable walletEncrypted = false
  @observable encryptResult = undefined
  @observable passphrase = ''
  @observable walletUnlockedUntil = 0
  @observable unlockDialogOpen = false

  history = {}

  @computed get needsToBeUnlocked() {
    if (this.walletEncrypted) return false;
    if (this.walletUnlockedUntil === 0) return true;
    const now = moment();
    const unlocked = moment.unix(this.walletUnlockedUntil).subtract(1, 'hours');
    return now.isSameOrAfter(unlocked);
  }

  constructor(app) {
    this.app = app;
    this.history = new WalletHistoryStore(app);

    // Set a default lastUsedAddress if there was none selected before
    reaction(
      () => this.addresses,
      () => {
        if (_.isEmpty(this.lastUsedAddress) && !_.isEmpty(this.addresses)) {
          this.lastUsedAddress = this.addresses[0].address;
        }
      }
    );
  }

  @action
  checkWalletEncrypted = async () => {
    try {
      const { data: { result } } = await axios.get(Routes.api.getWalletInfo);

      runInAction(() => {
        this.walletEncrypted = result && !_.isUndefined(result.unlocked_until);
        this.walletUnlockedUntil = result && result.unlocked_until ? result.unlocked_until : 0;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.getWalletInfo);
      });
    }
  }

  @action
  encryptWallet = async (passphrase) => {
    try {
      const { data: { result } } = await axios.post(Routes.api.encryptWallet, {
        passphrase,
      });
      this.encryptResult = result;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.encryptWallet);
      });
    }
  }

  @action
  onPassphraseChange = (passphrase) => {
    this.passphrase = passphrase;
  }

  @action
  clearEncryptResult = () => {
    this.encryptResult = undefined;
  }

  @action
  onToAddressChange = (self, event) => {
    this.toAddress = event.target.value;
  };

  @action
  onAmountChange = (self, event) => {
    this.withdrawAmount = event.target.value;
  };

  @action
  onTokenChange = (self, event) => {
    this.selectedToken = event.target.value;
  };

  @action
  backupWallet = async () => {
    try {
      await axios.post(Routes.api.backupWallet);
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.backupWallet);
      });
    }
  }

  @action
  confirm = (onWithdraw) => {
    let amount = this.withdrawAmount;
    if (this.selectedToken === Token.BOT) {
      amount = decimalToSatoshi(this.withdrawAmount);
    }
    this.createTransferTransaction(this.walletAddress, this.toAddress, this.selectedToken, amount);
    runInAction(() => {
      onWithdraw();
      this.txConfirmDialogOpen = false;
      Tracking.track('myWallet-withdraw');
    });
  };

  @action
  prepareWithdraw = async (walletAddress) => {
    this.walletAddress = walletAddress;
    const { data: { result } } = await axios.post(Routes.api.transactionCost, {
      type: TransactionType.TRANSFER,
      token: this.selectedToken,
      amount: Number(this.withdrawAmount),
      optionIdx: undefined,
      topicAddress: undefined,
      oracleAddress: undefined,
      senderAddress: walletAddress,
    });
    runInAction(() => {
      this.txFees = result;
      this.txConfirmDialogOpen = true;
    });
  }

  @action
  createTransferTransaction = async (walletAddress, toAddress, selectedToken, amount) => {
    try {
      const { data: { transfer } } = await createTransferTx(walletAddress, toAddress, selectedToken, amount);
      const { history } = this.app.wallet;
      history.fullList.push(new Transaction(transfer));
      history.fullList = _.orderBy(history.fullList, [history.orderBy], [history.direction]);
      const start = history.page * history.perPage;
      history.list = _.slice(history.fullList, start, start + history.perPage);
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.createTransferTx);
      });
    }
  }
}
