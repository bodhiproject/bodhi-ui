import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { TxConfirmDialog } from 'components';


export const OracleTxConfirmDialog = inject('store')(injectIntl(observer(({ store: { oraclePage }, intl, id }) => {
  const { oracle } = oraclePage;
  return (
    <TxConfirmDialog
      onClose={() => oraclePage.txConfirmDialogOpen = false}
      onConfirm={oraclePage.confirm}
      txFees={oracle.txFees}
      open={oraclePage.txConfirmDialogOpen}
      txToken={oracle.token}
      txAmount={oraclePage.amount}
      txDesc={intl.formatMessage({ id }, { option: oraclePage.selectedOption.name })}
    />
  );
})));
