import { observable, action, runInAction, reaction, computed } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { TransactionType, Token } from 'constants';
import { Transaction, TransactionCost } from 'models';
import { defineMessages } from 'react-intl';

import axios from '../network/api';
import Routes from '../network/routes';
import { createTransferTx } from '../network/graphql/mutations';
import { decimalToSatoshi, satoshiToDecimal } from '../helpers/utility';
import Tracking from '../helpers/mixpanelUtil';
import WalletAddress from './models/WalletAddress';

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
  currentWalletAddress: undefined,
  walletEncrypted: false,
  encryptResult: undefined,
  passphrase: '',
  walletUnlockedUntil: 0,
  unlockDialogOpen: false,
  changePassphraseResult: undefined,
  txConfirmDialogOpen: false,
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
  @observable currentWalletAddress = INIT_VALUE.currentWalletAddress;
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

  @computed get currentAddress() {
    return this.currentWalletAddress ? this.currentWalletAddress.address : '';
  }

  @computed get needsToBeUnlocked() {
    if (this.walletEncrypted) return false;
    if (this.walletUnlockedUntil === 0) return true;
    const now = moment();
    const unlocked = moment.unix(this.walletUnlockedUntil).subtract(1, 'hours');
    return now.isSameOrAfter(unlocked);
  }

  @computed get withdrawDialogHasError() {
    if (this.withdrawDialogError.withdrawAmount !== '') return true;
    if (this.withdrawDialogError.walletAddress !== '') return true;
    return false;
  }

  @computed get lastAddressWithdrawLimit() {
    return {
      QTUM: this.currentWalletAddress ? this.currentWalletAddress.qtum : 0,
      BOT: this.currentWalletAddress ? this.currentWalletAddress.bot : 0,
    };
  }

  constructor(app) {
    this.app = app;

    // Set a currentWalletAddress if there was none selected before
    reaction(
      () => this.addresses,
      () => {
        if (_.isEmpty(this.currentWalletAddress) && !_.isEmpty(this.addresses)) {
          [this.currentWalletAddress] = this.addresses;
        }
      }
    );

    if (this.app.global.localWallet) {
      this.checkWalletEncrypted();
    }
  }

  /**
   * Finds and sets the current wallet address based on the address.
   * @param {string} address Address to find in the list of wallet addresses.
   */
  setCurrentWalletAddress = (address) => {
    this.currentWalletAddress = _.find(this.addresses, { address });
  }

  /**
   * Calls the BodhiToken contract to get the BOT balance and sets the balance in the addresses.
   * @param {string} address Address to check the BOT balance of.
   */
  fetchBotBalance = async (address) => {
    try {
      const { data } = await axios.post(Routes.api.botBalance, {
        owner: address,
        senderAddress: address,
      });
      if (data.balance) {
        const index = _.findIndex(this.addresses, { address });
        if (index !== -1) {
          this.addresses[index].bot = satoshiToDecimal(data.balance);
        }
      }
    } catch (err) {
      console.error(`Error getting BOT balance for ${address}: ${err.message}`); // eslint-disable-line
    }
  }

  /**
   * Sets the account sent from Qrypto.
   * @param {object} account Account object.
   */
  @action
  onQryptoAccountChange = async (account) => {
    const { loggedIn, address, balance } = account;
    if (!loggedIn) {
      this.addresses = INIT_VALUE.addresses;
      return;
    }

    // If setting Qrypto's account for the first time, fetch the BOT balance right away.
    // After the initial BOT balance fetch, it will refetch on every new block.
    let fetchInitBotBalance = false;
    if (_.isEmpty(this.addresses)) {
      fetchInitBotBalance = true;
    }

    this.addresses = [new WalletAddress({
      address,
      qtum: balance,
      bot: 0,
    }, false)];

    if (fetchInitBotBalance) {
      this.fetchBotBalance(this.addresses[0].address);
    }
  }

  @action
  checkWalletEncrypted = async () => {
    try {
      const { data } = await axios.get(Routes.api.getWalletInfo);

      runInAction(() => {
        this.walletEncrypted = data && !_.isUndefined(data.unlocked_until);
        this.walletUnlockedUntil = data && data.unlocked_until ? data.unlocked_until : 0;
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
      const { data } = await axios.post(Routes.api.encryptWallet, {
        passphrase,
      });
      this.encryptResult = data;
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
      const { data } = await axios.post(Routes.api.validateAddress, { address: addressToVerify });
      return data.isvalid;
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
      this.withdrawDialogError.walletAddress = messages.withdrawDialogInvalidAddressMsg.id;
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
    } else if (Number(this.withdrawAmount) > this.lastAddressWithdrawLimit[this.selectedToken]) {
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
      const { data } = await axios.post(Routes.api.transactionCost, {
        type: TransactionType.TRANSFER,
        token: this.selectedToken,
        amount: this.selectedToken === Token.BOT ? decimalToSatoshi(this.withdrawAmount) : Number(this.withdrawAmount),
        optionIdx: undefined,
        topicAddress: undefined,
        oracleAddress: undefined,
        senderAddress: walletAddress,
      });
      const txFees = _.map(data, (item) => new TransactionCost(item));
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
      const { data } = await axios.post(Routes.api.walletPassphraseChange, {
        oldPassphrase,
        newPassphrase,
      });
      runInAction(() => {
        this.changePassphraseResult = data;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.walletPassphraseChange);
      });
    }
  }
}
