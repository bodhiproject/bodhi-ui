import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';

import WalletHistoryStore from './WalletHistoryStore';
import axios from '../../network/httpRequest';
import Routes from '../../network/routes';
import { createTransferTx } from '../../network/graphMutation';

export default class {
  @observable addresses = []
  @observable lastUsedAddress = ''
  @observable walletEncrypted = false
  @observable encryptResult = undefined
  @observable passphrase = ''
  @observable walletUnlockedUntil = 0

  history = {}

  constructor(app) {
    this.app = app;
    this.history = new WalletHistoryStore();

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
  createTransferTx(walletAddress, toAddress, selectedToken, amount) {
    createTransferTx(walletAddress, toAddress, selectedToken, amount);
  }
}
