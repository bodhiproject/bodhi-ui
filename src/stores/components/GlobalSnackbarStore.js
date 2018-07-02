import { observable, action } from 'mobx';


export default class GlobalSnackbarStore {
  @observable isVisible = false
  @observable message = ''

  @action
  onClose = () => {
    this.message = '';
    this.isVisible = false;
  }
}
