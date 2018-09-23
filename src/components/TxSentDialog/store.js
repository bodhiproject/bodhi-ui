import { observable, action, reaction } from 'mobx';


const INIT_VALUES = {
  visible: false,
  txid: undefined,
  onCloseFunc: undefined,
};

export default class TxSentDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable txid = INIT_VALUES.txid;
  onCloseFunc = INIT_VALUES.onCloseFunc;

  constructor(app) {
    this.app = app;

    reaction(
      () => this.visible,
      () => {
        if (!this.visible) {
          if (this.onCloseFunc) this.onCloseFunc();
          this.reset();
        }
      },
    );
  }

  @action
  open = (txid) => {
    this.txid = txid;
    this.visible = true;
  }

  @action
  reset = () => Object.assign(this, INIT_VALUES);
}
