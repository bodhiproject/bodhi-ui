import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { TxConfirmDialog } from 'components';


export const OracleTxConfirmDialog = inject('store')(injectIntl(observer(({ store: { eventPage }, intl, id }) => {
  const { oracle } = eventPage;

  return eventPage.txConfirmDialogOpen && (
    <TxConfirmDialog
      onClose={() => eventPage.txConfirmDialogOpen = false}
      onConfirm={eventPage.confirm}
      txFees={oracle.txFees}
      open={eventPage.txConfirmDialogOpen}
      txToken={oracle.token}
      txAmount={eventPage.amount}
      txDesc={intl.formatMessage({ id }, { option: eventPage.selectedOption.name === 'Invalid' ? oracle.localizedInvalid.parse(intl.locale) : eventPage.selectedOption.name })}
    />
  );
})));
