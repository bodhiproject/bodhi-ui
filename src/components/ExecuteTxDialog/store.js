import { observable } from 'mobx';

import { WalletProvider } from '../../constants';

const INIT_VALUES = {
  visible: false,
  provider: WalletProvider.QRYPTO,
  txFees: [],
};

export default class ExecuteTxDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
  @observable txFees = INIT_VALUES.txFees;
}
