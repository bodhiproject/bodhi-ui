import { observable, action, reaction } from 'mobx';


const INIT_VALUES = {
  visible: false,
  txid: undefined,
};

export default class TxSentDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable txid = INIT_VALUES.txid;

  constructor(app) {
    this.app = app;

    reaction(
      () => this.txid,
      () => this.visible = !!this.txid,
    );
  }

  @action
  onClose = () => this.txid = INIT_VALUES.txid
}
