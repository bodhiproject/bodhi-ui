import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { TransactionType } from '../../constants';

const MultipleTransactionMessage = ({ store: { tx: { type } } }) => {
  const { APPROVE_CREATE_EVENT, CREATE_EVENT, APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE } = TransactionType;
  if (type === APPROVE_CREATE_EVENT || type === APPROVE_SET_RESULT || type === APPROVE_VOTE) {
    return (
      <div>
        <FormattedMessage
          id='txConfirm.txOne'
          defaultMessage='Confirmation for transaction 1/2. You will be required to confirm another transaction when this transaction is successful.'
        />
      </div>
    );
  } else if (type === CREATE_EVENT || type === SET_RESULT || type === VOTE) {
    return (
      <div>
        <FormattedMessage id='txConfirm.txTwo' defaultMessage='Confirmation for transaction 2/2.' />
      </div>
    );
  }
  return null;
};

export default injectIntl(inject('store')(observer(MultipleTransactionMessage)));
