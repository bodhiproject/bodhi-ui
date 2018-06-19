import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TableCell } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import Routes from '../../network/routes';


const TransactionHistoryID = ({ classes, transaction }) => (
  <TableCell padding="dense" className={classes.txidRow}>
    <div className={classes.txidWrapper}>
      <div className={classes.txidLabel}>
        <FormattedMessage id="str.transactionId" defaultMessage="Transaction ID" />
      </div>
      <div
        className={classes.txIdText}
        onClick={(e) => {
          e.stopPropagation();
          window.open(`${Routes.explorer.tx}/${transaction.txid}`, '_blank');
        }}
      >
        {transaction.txid}
      </div>
    </div>
  </TableCell>
);

TransactionHistoryID.propTypes = {
  classes: PropTypes.object.isRequired,
  transaction: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(TransactionHistoryID));
