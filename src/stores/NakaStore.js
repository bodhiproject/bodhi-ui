import { action, observable } from 'mobx';
import promisify from 'js-promisify';

import { urls, CHAIN_ID, NETWORK } from '../config/app';
export default class NakaStore {
  @observable loggedIn = false;
  @observable popoverOpen = false;
  @observable popoverMessageId = undefined;
  @observable account = undefined;
  @observable balance = 0
  @observable network = undefined

  constructor(app) {
    this.app = app;
  }

  init = () => {
    if (!this.app.global.naka) {
      if (window.naka) {
        this.app.global.naka = window.naka;
        this.handleNakaWalletAccountChange();
        this.app.global.naka.currentProvider.publicConfigStore.on('update', () => this.handleNakaWalletAccountChange());
      }
    }
  }

  isInstalled = () => !!window.naka

  /**
   * Registers with Naka Wallet and sets the event handler if not using a local wallet.
   */
  // registerNakaWallet = () => {
  //   if (!this.localWallet) {
  //     console.log('Trying to register with Naka Wallet...'); // eslint-disable-line
  //     window.addEventListener('message', this.handleWindowMessage, false);
  //     window.postMessage({ message: { type: 'CONNECT_NakaWallet' } }, '*');
  //   }
  // }

  /**
   * Handles all window messages.
  //  * @param {MessageEvent} event Message to handle.
  //  */
  // handleWindowMessage = (event) => {
  //   if (event.data.message && event.data.message.type) {
  //     const types = {
  //       NakaWallet_INSTALLED_OR_UPDATED: this.handleNakaWalletInstall,
  //       NakaWallet_ACCOUNT_CHANGED: this.handleNakaWalletAccountChange,
  //     };
  //     const messageAction = types[event.data.message.type];
  //     if (messageAction) messageAction(event);
  //   }
  // }

  /**
   * Handles the event when Naka Wallet posts an install or update message.
   */
  // handleNakaWalletInstall = () => {
  //   window.location.reload();
  // }

  /**
   * Handles the event when Naka Wallet posts an account change message.
   * @param {MessageEvent} event Message to handle.
   */
  @action
  handleNakaWalletAccountChange = async () => {
    const [acct] = this.app.global.naka.eth.accounts;
    this.account = acct;
    this.loggedIn = !!this.account;
    if (this.account) {
      const data = await promisify(this.app.global.naka.eth.getBalance, [this.account]);
      this.balance = data.toString(10);
    }
    // TODO: log error here if !account.

    // Init network
    const { network } = this.app.global.naka.version;
    if (network === CHAIN_ID.MAINNET) {
      this.network = NETWORK.MAINNET;
    } else if (network === CHAIN_ID.TESTNET) {
      this.network = NETWORK.TESTNET;
    }
    // TODO: log error here if network doesnt match
    // what happens if CHAIN_ID doesnt match? shouldn't allow users to do any txs
    // since wrong network.

    this.app.wallet.onNakaAccountChange({
      loggedIn: this.loggedIn,
      network: this.network,
      address: this.account,
      balance: this.balance,
    });
  }

  @action
  checkLoginAndPopup = () => {
    const { ui: { showNoWalletDialog } } = this.app;
    if (!this.loggedIn) {
      showNoWalletDialog();
      return false;
    }
    return true;
  }

  getSlicedAddress = () => {
    if (this.loggedIn) return `${this.account.slice(0, 6)}...${this.account.slice(-6)}`;
    return '';
  }

  @action
  openPopover = async (messageId) => {
    this.popoverOpen = true;

    if (messageId) {
      this.popoverMessageId = messageId;
    } else if (!this.isInstalled) {
      this.popoverMessageId = 'naka.notInstalled';
    } else if (!this.loggedIn) {
      this.popoverMessageId = 'naka.notLoggedIn';
      await window.ethereum.enable();
    } else {
      this.popoverMessageId = 'naka.loggedIn';
    }
  }

  @action
  onInstallClick = () => {
    window.open(urls.NakaWalletWebStore, '_blank');
    this.popoverOpen = false;
  }
}
