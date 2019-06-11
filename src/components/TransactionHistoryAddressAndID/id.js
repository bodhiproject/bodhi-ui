import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withStyles, TableCell } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles';
import { EXPLORER } from '../../network/routes';


const TransactionHistoryID = ({ classes, transaction, colSpan }) => (
  <TableCell colSpan={colSpan}>
    <div className={classes.txidWrapper}>
      <div>
        <FormattedMessage id="str.transactionIdX" defaultMessage="Transaction ID: {txid}" values={{ txid: '' }} />
      </div>
      <div
        className={cx(classes.transactionHistoryTxidTxt, classes.txIdText)}
        onClick={(e) => {
          e.stopPropagation();
          window.open(`${EXPLORER.TX}/${transaction.txid}`, '_blank');
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
