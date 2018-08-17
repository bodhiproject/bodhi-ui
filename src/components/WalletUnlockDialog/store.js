import { observable, action, runInAction } from 'mobx';

import axios from '../../network/api';
import Routes from '../../network/routes';
import Config from '../../config/app';

export default class WalletUnlockDialogStore {
  @observable isVisible = false

  passphrase = ''
  unlockMinutes = Config.defaults.unlockWalletMins

  constructor(app) {
    this.app = app;
  }

  @action
  unlockWallet = async () => {
    try {
      // Unlock the wallet
      await axios.post(Routes.api.unlockWallet, {
        passphrase: this.passphrase,
        timeout: this.unlockMinutes * 60,
      });

      // Get the unlocked_until timestamp
      const { data: { result } } = await axios.get(Routes.api.getWalletInfo);
      const unlockedUntil = result.unlocked_until;

      runInAction(() => {
        this.app.wallet.walletUnlockedUntil = unlockedUntil;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.unlockWallet);
      });
    }
  }
}
