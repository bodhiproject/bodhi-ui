import { action, observable } from 'mobx';

import { urls } from '../../config/app';


export default class InstallQryptoPromptStore {
  @observable popoverOpen = false;

  @action
  onInstallClick = () => {
    window.open(urls.qryptoWebStore, '_blank');
    this.popoverOpen = false;
  }
}
