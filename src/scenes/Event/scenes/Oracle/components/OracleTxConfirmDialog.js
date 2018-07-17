/* eslint-disable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { TxConfirmDialog } from 'components';


export const OracleTxConfirmDialog = inject('store')(injectIntl(observer(({ store: { oraclePage }, intl, id, option }) => {
  const { oracle } = oraclePage;
  return (
    <TxConfirmDialog
      onClose={() => oraclePage.txConfirmDialogOpen = false /* eslint-disable-line no-param-reassign */}
      onConfirm={oraclePage.confirm}
      txFees={oracle.txFees}
      open={oraclePage.txConfirmDialogOpen}
      txToken={oracle.token}
      txAmount={oraclePage.amount}
      txDesc={intl.formatMessage({ id }, { option: oraclePage.selectedOption.name })}
    />
  );
})));
