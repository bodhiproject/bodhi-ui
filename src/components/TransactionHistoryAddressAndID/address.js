import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

const TransactionHistoryAddress = ({ classes, transaction, colSpan }) => (
  <TableCell padding="dense" colSpan={colSpan}>
    <div className={classes.txidWrapper}>
      <div>
        <FormattedMessage id="str.addressUsed" defaultMessage="Address Used" />
      </div>
      <div className={classes.transactionHistoryTxidTxt}>
        {transaction.senderAddress}
      </div>
    </div>
  </TableCell>
);

TransactionHistoryAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(TransactionHistoryAddress));
