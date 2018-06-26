import { observable, action, runInAction } from 'mobx';
import axios from '../network/httpRequest';
import Routes from '../network/routes';


export default class WalletStore {
  @observable addresses = []
  @observable walletEncrypted = false
  @observable encryptResult = undefined
  @observable passphrase = ''

  constructor(app) {
    this.app = app;
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
}
