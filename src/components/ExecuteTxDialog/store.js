import { observable } from 'mobx';

import { WalletProvider } from '../../constants';

const INIT_VALUES = {
  visible: false,
  provider: WalletProvider.QRYPTO,
  txFees: [],
  txAction: undefined,
  txOption: undefined,
  txDesc: undefined,
  txAmount: undefined,
  txToken: undefined,
};

export default class ExecuteTxDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable provider = INIT_VALUES.provider;
  @observable txFees = INIT_VALUES.txFees;
  @observable txAction = INIT_VALUES.txAction;
  @observable txOption = INIT_VALUES.txOption;
  @observable txAmount = INIT_VALUES.txAmount;
  @observable txToken = INIT_VALUES.txToken;
}
