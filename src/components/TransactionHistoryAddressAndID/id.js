import React, { PropTypes } from 'react';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class TransactionHistoryID extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
  };

  render() {
    const { classes, transaction } = this.props;
    return (
      <TableCell padding="dense" className={classes.txidRow}>
        <div className={classes.txidWrapper}>
          <div className={classes.txidLabel}>
            <FormattedMessage id="str.transactionId" defaultMessage="Transaction ID" />
          </div>
          <div className={classes.txIdText} onClick={this.onIdClick}>
            {transaction.txid}
          </div>
        </div>
      </TableCell>
    );
  }

  onIdClick = () => {
    const { transaction } = this.props;
    window.open(`https://testnet.qtum.org/tx/${transaction.txid}`, '_blank');
  };
}

export default injectIntl(withStyles(styles, { withTheme: true })(TransactionHistoryID));
