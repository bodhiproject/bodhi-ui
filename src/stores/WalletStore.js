import { observable, action, runInAction, computed } from 'mobx';
import { isEmpty, find, findIndex } from 'lodash';
import moment from 'moment';
import { Token } from 'constants';
import { defineMessages } from 'react-intl';
import { BigNumber } from 'bignumber.js';

import axios from '../network/api';
import Routes from '../network/routes';
import { decimalToSatoshi, satoshiToDecimal } from '../helpers/utility';
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

export default class WalletStore {
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

    if (this.app.global.localWallet) {
      this.checkWalletEncrypted();
    }
  }

  /**
   * Finds and sets the current wallet address based on the address.
   * @param {string} address Address to find in the list of wallet addresses.
   */
  setCurrentWalletAddress = (address) => {
    this.currentWalletAddress = find(this.addresses, { address });
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
        const index = findIndex(this.addresses, { address });
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
    const { loggedIn, network, address, balance } = account;

    // Reset addresses if logged out
    if (!loggedIn) {
      this.addresses.clear();
      this.currentWalletAddress = INIT_VALUE.currentWalletAddress;
      return;
    }

    // Stop login if the chain network does not match
    if (network.toLowerCase() !== process.env.CHAIN_NETWORK) {
      this.app.qrypto.openPopover('qrypto.loggedIntoWrongNetwork');
      return;
    }

    // If setting Qrypto's account for the first time or the address changes, fetch the BOT balance right away.
    // After the initial BOT balance fetch, it will refetch on every new block.
    const fetchInitBotBalance = isEmpty(this.addresses);

    const index = findIndex(this.addresses, { address });
    if (index === -1) {
      // Push the WalletAddress if it is not in the list of addresses
      const walletAddress = new WalletAddress({ address, qtum: balance, bot: 0 }, false);
      this.addresses.push(walletAddress);
      this.currentWalletAddress = walletAddress;
    } else {
      // Update existing balances
      const walletAddress = this.addresses[index];
      walletAddress.qtum = balance;
      if (this.currentWalletAddress.address === address) {
        this.currentWalletAddress.qtum = balance;
      }
    }

    if (fetchInitBotBalance) {
      this.fetchBotBalance(address);
    }
  }

  /**
   * Checks the Bodhi Token allowance from the owner to spender.
   * @param {string} owner Approver of the tokens.
   * @param {string} spender Approvee of the tokens.
   * @return {string} Amount of the allowance.
   */
  checkAllowance = async (owner, spender) => {
    if (!owner || !spender || !this.currentAddress) {
      return undefined;
    }

    try {
      const { data: { remaining } } = await axios.post(Routes.api.allowance, {
        owner,
        spender,
        senderAddress: this.currentAddress,
      });
      return remaining;
    } catch (err) {
      console.error(`Error getting allowance: ${err.message}`); // eslint-disable-line
    }
  }

  /**
   * Checks if the allowance is enough.
   * @param {string} allowance Current allowance.
   * @param {string} needed Amount of allowance needed.
   * @return {boolean} True if the allowance is greater than or equal to needed.
   */
  isAllowanceEnough = (allowance, needed) => new BigNumber(allowance).isGreaterThanOrEqualTo(new BigNumber(needed));

  /**
   * Calls the BodhiToken contract to get the BOT balance and sets the balance in the addresses.
   * @param {string} address Address to check the BOT balance of.
   */
  fetchBotBalance = async (address) => {
    if (isEmpty(address)) {
      return;
    }

    try {
      const { data } = await axios.post(Routes.api.botBalance, {
        owner: address,
        senderAddress: address,
      });
      if (data.balance) {
        const bot = satoshiToDecimal(data.balance);

        // Update WalletAddress BOT in list of addresses
        const index = findIndex(this.addresses, { address });
        if (index !== -1) {
          this.addresses[index].bot = bot;
        }

        // Update current WalletAddress BOT if matching address
        if (this.currentWalletAddress && this.currentWalletAddress.address === address) {
          this.currentWalletAddress.bot = bot;
        }
      }
    } catch (err) {
      console.error(`Error getting BOT balance for ${address}: ${err.message}`); // eslint-disable-line
    }
  }

  @action
  checkWalletEncrypted = async () => {
    try {
      const { data } = await axios.get(Routes.api.getWalletInfo);

      runInAction(() => {
        this.walletEncrypted = data && !data.unlocked_until;
        this.walletUnlockedUntil = data && data.unlocked_until ? data.unlocked_until : 0;
      });
    } catch (error) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.getWalletInfo);
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
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.encryptWallet);
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
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.validateAddress);
      });
    }
  }

  @action
  validateWithdrawDialogWalletAddress = async () => {
    if (isEmpty(this.toAddress)) {
      this.withdrawDialogError.walletAddress = messages.withdrawDialogRequiredMsg.id;
    } else if (!(await this.isValidAddress(this.toAddress))) {
      this.withdrawDialogError.walletAddress = messages.withdrawDialogInvalidAddressMsg.id;
    } else {
      this.withdrawDialogError.walletAddress = '';
    }
  }

  @action
  validateWithdrawDialogAmount = () => {
    if (isEmpty(this.withdrawAmount)) {
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
  withdraw = async (walletAddress) => {
    this.walletAddress = walletAddress;
    const amount = this.selectedToken === Token.BOT
      ? decimalToSatoshi(this.withdrawAmount) : Number(this.withdrawAmount);
    await this.app.tx.addTransferTx(this.walletAddress, this.toAddress, amount, this.selectedToken);
  }

  @action
  backupWallet = async () => {
    try {
      await axios.post(Routes.api.backupWallet);
    } catch (error) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.backupWallet);
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
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.walletPassphraseChange);
      });
    }
  }
}
