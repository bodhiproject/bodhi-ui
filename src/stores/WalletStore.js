import { observable, action } from 'mobx';
import axios from '../network/httpRequest';
import Routes from '../network/routes';


export default class WalletStore {
  @observable addresses = []
  @observable walletEncrypted = false
  @observable encryptResult = undefined
  @observable error = ''
  @observable passphrase = ''

  @action
  encryptWallet = async (passphrase) => {
    try {
      const { data: { result } } = await axios.post(Routes.api.encryptWallet, {
        passphrase,
      });
      this.encryptResult = result;
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

  @action
  clearEncryptResult = () => {
    this.encryptResult = undefined;
  }
}
