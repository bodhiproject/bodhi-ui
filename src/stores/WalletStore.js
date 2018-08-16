import { observable, action, runInAction, reaction, computed } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { TransactionType, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';
import { defineMessages } from 'react-intl';

import axios from '../network/api';
import Routes from '../network/routes';
import { createTransferTx } from '../network/graphql/mutations';
import { decimalToSatoshi } from '../helpers/utility';
import Tracking from '../helpers/mixpanelUtil';

// TODO: ADD ERROR TEXT FIELD FOR WITHDRAW DIALOGS, ALSO INTL TRANSLATION UPDATE
const messages = defineMessages({
  withdrawDialogInvalidAddressMsg: {
    id: 'withdrawDialog.invalidAddress',
    defaultMessage: 'Invalid address',
  },
  withdrawDialogAmountLargerThanZeroMsg: {
    id: 'withdrawDialog.amountLargerThanZero',
    defaultMessage: 'Amount should be larger than 0',
  },
  withdrawDialogAmountExceedLimitMsg: {
    id: 'withdrawDialog.amountExceedLimit',
    defaultMessage: 'Amount exceed the limit',
  },
  withdrawDialogRequiredMsg: {
    id: 'withdrawDialog.required',
    defaultMessage: 'Required',
  },
});

const INIT_VALUE = {
  addresses: [],
  lastUsedAddress: '',
  walletEncrypted: false,
  encryptResult: undefined,
  passphrase: '',
  walletUnlockedUntil: 0,
  unlockDialogOpen: false,
  changePassphraseResult: undefined,
  txConfirmDialogOpen: false,
  selectedAddressBot: undefined,
};

const INIT_VALUE_DIALOG = {
  selectedToken: Token.QTUM,
  toAddress: '',
  withdrawAmount: '',
  withdrawDialogError: {
    withdrawAmount: '',
    walletAddress: '',
  },
};

export default class {
  @observable addresses = INIT_VALUE.addresses;
  @observable lastUsedAddress = INIT_VALUE.lastUsedAddress;
  @observable walletEncrypted = INIT_VALUE.walletEncrypted;
  @observable encryptResult = INIT_VALUE.encryptResult;
  @observable passphrase = INIT_VALUE.passphrase;
  @observable walletUnlockedUntil = INIT_VALUE.walletUnlockedUntil;
  @observable unlockDialogOpen = INIT_VALUE.unlockDialogOpen;
  @observable selectedToken = INIT_VALUE_DIALOG.selectedToken;
  @observable changePassphraseResult = INIT_VALUE.changePassphraseResult;
  @observable txConfirmDialogOpen = INIT_VALUE.txConfirmDialogOpen;
  @observable withdrawDialogError = INIT_VALUE_DIALOG.withdrawDialogError;
  @observable withdrawAmount = INIT_VALUE_DIALOG.withdrawAmount;
  @observable toAddress = INIT_VALUE_DIALOG.toAddress;
  @observable selectedAddressBot = INIT_VALUE.selectedAddressBot;

  @computed get needsToBeUnlocked() {
    if (this.walletEncrypted) return false;
    if (this.walletUnlockedUntil === 0) return true;
    const now = moment();
    const unlocked = moment.unix(this.walletUnlockedUntil).subtract(1, 'hours');
    return now.isSameOrAfter(unlocked);
  }

  @computed get withdrawDialogHasError() {
    if (this.withdrawDialogError.withdrawAmount) return true;
    if (this.withdrawDialogError.walletAddress) return true;
    return false;
  }

  @computed get withdrawLimit() {
    switch (this.selectedToken) {
      case Token.QTUM: {
        return _.sumBy(this.addresses, (w) => w.qtum ? w.qtum : 0);
      }
      case Token.BOT: {
        return this.selectedAddressBot;
      }
      default: {
        throw new Error(`Invalid selectedToken ${this.selectedToken}`);
      }
    }
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

  isValidAddress = async (addressToVerify) => {
    try {
      const { data: { result } } = await axios.post(Routes.api.validateAddress, { address: addressToVerify });
      return result.isvalid;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.validateAddress);
      });
    }
  }

  @action
  validateWithdrawDialogWalletAddress = async () => {
    if (_.isEmpty(this.toAddress)) {
      this.withdrawDialogError.walletAddress = messages.withdrawDialogRequiredMsg.id;
    } else if (!(await this.isValidAddress(this.toAddress))) {
      this.withdrawDialogError.walletAddress = messages.withdrawDialogAmountLargerThanZeroMsg.id;
    } else {
      this.withdrawDialogError.walletAddress = '';
    }
  }

  @action
  validateWithdrawDialogAmount = () => {
    if (_.isEmpty(this.withdrawAmount)) {
      this.withdrawDialogError.withdrawAmount = messages.withdrawDialogRequiredMsg.id;
    } else if (Number(this.withdrawAmount) <= 0) {
      this.withdrawDialogError.withdrawAmount = messages.withdrawDialogAmountLargerThanZeroMsg.id;
    } else if (Number(this.withdrawAmount) > Number(this.withdrawLimit)) { // Automatically switch by token
      this.withdrawDialogError.withdrawAmount = messages.withdrawDialogAmountExceedLimitMsg.id;
    } else {
      this.withdrawDialogError.withdrawAmount = '';
    }
  }

  @action
  resetWithdrawDialog = () => Object.assign(this, INIT_VALUE_DIALOG);

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
        amount: this.selectedToken === Token.BOT ? decimalToSatoshi(this.withdrawAmount) : Number(this.withdrawAmount),
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
      runInAction(() => {
        this.app.pendingTxsSnackbar.init();
      });
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
