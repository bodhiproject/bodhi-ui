import { observable, action, runInAction } from 'mobx';

import axios from '../../network/httpRequest';
import Routes from '../../network/routes';

export default class WalletUnlockDialogStore {
  @observable isVisible = false

  constructor(app) {
    this.app = app;
  }

  @action
  unlockWallet = async () => {
    try {
      const timeoutSec = action.timeout * 60;

      // Unlock the wallet
      await axios.post(Routes.api.unlockWallet, {
        passphrase: action.passphrase,
        timeout: timeoutSec,
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
