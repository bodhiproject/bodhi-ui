import { observable } from 'mobx';
import UiStore from './UiStore';


class AppStore {
  @observable loading = true
  ui = {} // ui store

  constructor() {
    this.ui = new UiStore();
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}
export default store;
