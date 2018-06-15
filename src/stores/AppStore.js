import UiStore from './UiStore';


class AppStore {
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
