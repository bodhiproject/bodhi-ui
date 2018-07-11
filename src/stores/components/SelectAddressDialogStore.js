import { observable, action } from 'mobx';


export default class SelectAddressDialogStore {
  @observable isVisible = false;

  @action
  setVisibility = (visibility) => {
    this.isVisible = visibility;
  }
}
