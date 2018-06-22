import { observable, action } from 'mobx';
import axios from '../network/httpRequest';
import Routes from '../network/routes';


export default class WalletStore {
  @observable addresses = []
  @observable walletEncrypted = false
  @observable error = ''
  @observable passphrase = ''

  @action.bound
  async encryptWallet(passphrase) {
    try {
      const { data: { result } } = await axios.post(Routes.api.encryptWallet, {
        passphrase,
      });
      this.result = result;
    } catch (error) {
      const errorObject = {
        route: Routes.api.encryptWallet,
        message: error.message,
      };
      this.error = errorObject;
    }
  }

  @action
  onPassphraseChange = (passphrase) => {
    this.passphrase = passphrase;
  }
}
