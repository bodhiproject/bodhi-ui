import { observable, action, runInAction, reaction, computed } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { TransactionType, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';

import axios from '../network/httpRequest';
import Routes from '../network/routes';
import { createTransferTx } from '../network/graphMutation';
import { decimalToSatoshi } from '../helpers/utility';
import Tracking from '../helpers/mixpanelUtil';


const INIT_VALUE = {
  addresses: [],
  lastUsedAddress: '',
  walletEncrypted: false,
  encryptResult: undefined,
  passphrase: '',
  walletUnlockedUntil: 0,
  unlockDialogOpen: false,
  selectedToken: Token.QTUM,
  changePassphraseResult: undefined,
  txConfirmDialogOpen: false,
};

export default class {
  @observable addresses = INIT_VALUE.addresses;
  @observable lastUsedAddress = INIT_VALUE.lastUsedAddress;
  @observable walletEncrypted = INIT_VALUE.walletEncrypted;
  @observable encryptResult = INIT_VALUE.encryptResult;
  @observable passphrase = INIT_VALUE.passphrase;
  @observable walletUnlockedUntil = INIT_VALUE.walletUnlockedUntil;
  @observable unlockDialogOpen = INIT_VALUE.unlockDialogOpen;
  @observable selectedToken = INIT_VALUE.selectedToken;
  @observable changePassphraseResult = INIT_VALUE.changePassphraseResult;
  @observable txConfirmDialogOpen = INIT_VALUE.txConfirmDialogOpen;

  @computed get needsToBeUnlocked() {
    if (this.walletEncrypted) return false;
    if (this.walletUnlockedUntil === 0) return true;
    const now = moment();
    const unlocked = moment.unix(this.walletUnlockedUntil).subtract(1, 'hours');
    return now.isSameOrAfter(unlocked);
  }

  constructor(app) {
    this.app = app;

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
    try {
      const { data: { result } } = await axios.post(Routes.api.transactionCost, {
        type: TransactionType.TRANSFER,
        token: this.selectedToken,
        amount: this.withdrawAmount,
        optionIdx: undefined,
        topicAddress: undefined,
        oracleAddress: undefined,
        senderAddress: walletAddress,
      });
      const txFees = _.map(result, (item) => new TransactionCost(item));
      runInAction(() => {
        this.txFees = txFees;
        this.txConfirmDialogOpen = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.transactionCost);
      });
    }
  }

  @action
  createTransferTransaction = async (walletAddress, toAddress, selectedToken, amount) => {
    try {
      const { data: { transfer } } = await createTransferTx(walletAddress, toAddress, selectedToken, amount);
      this.app.myWallet.history.addTransaction(new Transaction(transfer));
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.createTransferTx);
      });
    }
  }

  @action
  changePassphrase = async (oldPassphrase, newPassphrase) => {
    try {
      const changePassphraseResult = await axios.post(Routes.api.walletPassphraseChange, {
        oldPassphrase,
        newPassphrase,
      });
      runInAction(() => {
        this.changePassphraseResult = changePassphraseResult;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.walletPassphraseChange);
      });
    }
  }
}
