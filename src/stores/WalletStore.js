import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';
import axios from '../network/httpRequest';
import Routes from '../network/routes';


export default class WalletStore {
  @observable addresses = []
  @observable walletEncrypted = false
  @observable encryptResult = undefined
  @observable passphrase = ''
  @observable walletUnlockedUntil = 0

  constructor(app) {
    this.app = app;
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
}
