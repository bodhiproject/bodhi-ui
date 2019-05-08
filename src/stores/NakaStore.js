import { action, observable, reaction, toJS } from 'mobx';
import { Qweb3 } from 'qweb3';

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
    console.log('rere');
    if (!this.app.global.naka) {
      if (window.naka) {
        this.app.global.naka = window.naka;
        this.app.global.naka.currentProvider.publicConfigStore.on('update', () => this.handleQryptoAccountChange());
        console.log('TCL: NakaStore -> init -> this.app.global.naka', this.app.global.naka);
      }
    }
  }

  isInstalled = () => !!window.naka

  /**
   * Registers with Naka Wallet and sets the event handler if not using a local wallet.
   */
  // registerQrypto = () => {
  //   if (!this.localWallet) {
  //     console.log('Trying to register with Naka Wallet...'); // eslint-disable-line
  //     window.addEventListener('message', this.handleWindowMessage, false);
  //     window.postMessage({ message: { type: 'CONNECT_QRYPTO' } }, '*');
  //   }
  // }

  /**
   * Handles all window messages.
  //  * @param {MessageEvent} event Message to handle.
  //  */
  // handleWindowMessage = (event) => {
  //   if (event.data.message && event.data.message.type) {
  //     const types = {
  //       QRYPTO_INSTALLED_OR_UPDATED: this.handleQryptoInstall,
  //       QRYPTO_ACCOUNT_CHANGED: this.handleQryptoAccountChange,
  //     };
  //     const messageAction = types[event.data.message.type];
  //     if (messageAction) messageAction(event);
  //   }
  // }

  /**
   * Handles the event when Naka Wallet posts an install or update message.
   */
  // handleQryptoInstall = () => {
  //   window.location.reload();
  // }

  /**
   * Handles the event when Naka Wallet posts an account change message.
   * @param {MessageEvent} event Message to handle.
   */
  @action
  handleQryptoAccountChange = async (event) => {
    const [acct] = this.app.global.naka.eth.accounts;
    this.account = acct;

    if (this.account) {
      this.app.global.naka.eth.getBalance(this.account, (err, balance) => {
        if (err) {
          // logger.error(`Error getting wallet accounts: ${err.message}`)
        }
        this.balance = balance.toString(16);
      });
    }

    // Init network
    const { network } = this.app.global.naka.version;
    if (network === CHAIN_ID.MAINNET) {
      this.network = NETWORK.MAINNET;
    } else if (network === CHAIN_ID.TESTNET) {
      this.network = NETWORK.TESTNET;
    }

    this.loggedIn = !!this.account;
    this.app.wallet.onNakaAccountChange({ loggedIn: this.loggedIn, network: this.network, address: this.account, balance: this.balance });
  }

  @action
  openPopover = (messageId) => {
    this.popoverOpen = true;

    if (messageId) {
      this.popoverMessageId = messageId;
    } else if (!this.isInstalled) {
      this.popoverMessageId = 'naka.notInstalled';
    } else if (!this.loggedIn) {
      this.popoverMessageId = 'naka.notLoggedIn';
    } else {
      this.popoverMessageId = 'naka.loggedIn';
    }
  }

  @action
  onInstallClick = () => {
    window.open(urls.qryptoWebStore, '_blank');
    this.popoverOpen = false;
  }
}
