import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import { sumBy } from 'lodash';

import styles from './styles';
import { getTxTypeFormatted } from '../../helpers/utility';

const ExplanationMessage = ({ classes, intl, store: { tx: { fees, type } } }) => {
  const txAction = getTxTypeFormatted(type, intl);
  const txFee = sumBy(fees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
  return (
    <div className={classes.explanationMsgContainer}>
      <FormattedMessage
        id='txConfirm.txFeeMsg'
        defaultMessage='You are about to {txAction} with a maximum transaction fee of {txFee} QTUM. Any unused transaction fees will be refunded to you.'
        values={{ txAction, txFee }}
      />
    </div>
  );
};

export default withStyles(styles)(injectIntl(inject('store')(observer(ExplanationMessage))));
