import { action, observable } from 'mobx';

import { urls } from '../../config/app';


export default class InstallQryptoPromptStore {
  @observable popoverOpen = false;

  @action
  open = () => {
    this.popoverOpen = true;
  }

  @action
  onInstallClick = () => {
    window.open(urls.qryptoWebStore, '_blank');
    this.popoverOpen = false;
  }
}
