import { observable } from 'mobx';

const INIT_VALUES = {
  visible: false,
  provider: 'qrypto',
};

export default class ExecuteTxDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
}
