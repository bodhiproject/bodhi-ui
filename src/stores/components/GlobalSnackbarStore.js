import { observable } from 'mobx';


export default class GlobalSnackbarStore {
  @observable isVisible = false
  @observable message = ''
}
