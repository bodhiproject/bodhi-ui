import { action, observable } from 'mobx';
import { Qweb3 } from 'qweb3';

import { urls } from '../config/app';

export default class QryptoStore {
  @observable loggedIn = false;
  @observable popoverOpen = false;
  @observable popoverMessageId = undefined;

  constructor(app) {
    this.app = app;
    this.registerQrypto();
  }

  isInstalled = () => !!window.qrypto

  /**
   * Registers with Qrypto and sets the event handler if not using a local wallet.
   */
  registerQrypto = () => {
    if (!this.localWallet) {
      console.log('Trying to register with Qrypto...'); // eslint-disable-line
      window.addEventListener('message', this.handleWindowMessage, false);
      window.postMessage({ message: { type: 'CONNECT_QRYPTO' } }, '*');
    }
  }

  /**
   * Handles all window messages.
   * @param {MessageEvent} event Message to handle.
   */
  handleWindowMessage = (event) => {
    if (event.data.message && event.data.message.type) {
      const types = {
        QRYPTO_INSTALLED_OR_UPDATED: this.handleQryptoInstall,
        QRYPTO_ACCOUNT_CHANGED: this.handleQryptoAccountChange,
      };
      const messageAction = types[event.data.message.type];
      if (messageAction) messageAction(event);
    }
  }

  /**
   * Handles the event when Qrypto posts an install or update message.
   */
  handleQryptoInstall = () => {
    window.location.reload();
  }

  /**
   * Handles the event when Qrypto posts an account change message.
   * @param {MessageEvent} event Message to handle.
   */
  @action
  handleQryptoAccountChange = (event) => {
    if (event.data.message.payload.error) {
      console.error(event.data.message.payload.error); // eslint-disable-line
      return;
    }

    // Instantiate qweb3 instance on first callback
    if (!this.app.global.qweb3) {
      if (window.qrypto && window.qrypto.rpcProvider) {
        this.app.global.qweb3 = new Qweb3(window.qrypto.rpcProvider);
      }
    }

    this.loggedIn = event.data.message.payload.account.loggedIn;
    this.app.wallet.onQryptoAccountChange(event.data.message.payload.account);
  }

  @action
  openPopover = (messageId) => {
    this.popoverOpen = true;

    if (messageId) {
      this.popoverMessageId = messageId;
    } else if (!this.isInstalled) {
      this.popoverMessageId = 'qrypto.notInstalled';
    } else if (!this.loggedIn) {
      this.popoverMessageId = 'qrypto.notLoggedIn';
    } else {
      this.popoverMessageId = 'qrypto.loggedIn';
    }
  }

  @action
  onInstallClick = () => {
    window.open(urls.qryptoWebStore, '_blank');
    this.popoverOpen = false;
  }
}
