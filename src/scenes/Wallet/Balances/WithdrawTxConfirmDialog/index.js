/* eslint-disable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { TxConfirmDialog } from 'components';


const WithdrawTxConfirmDialog = inject('store')(injectIntl(observer(({ store: { wallet }, intl, id, onWithdraw }) => {
  return (
    <TxConfirmDialog
      onClose={() => wallet.txConfirmDialogOpen = false /* eslint-disable-line no-param-reassign */}
      onConfirm={wallet.confirm.bind(this, onWithdraw) /* eslint-disable-line no-param-reassign */}
      txFees={wallet.txFees}
      open={wallet.txConfirmDialogOpen}
      txToken={wallet.selectedToken}
      txAmount={wallet.withdrawAmount}
      txDesc={intl.formatMessage({ id }, { address: wallet.toAddress })}
    />
  );
})));
export default WithdrawTxConfirmDialog;