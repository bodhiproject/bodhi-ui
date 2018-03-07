import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { getLocalDateTimeString } from '../../../../helpers/utility';
import styles from './styles';

class PredictionTxHistory extends React.PureComponent {
  render() {
    const { classes, transactions, options } = this.props;

    return (
      <div className={classes.detailTxWrapper}>
        <Typography variant="headline" className={classes.detailTxTitle}>
          TRANSACTIONS
        </Typography> {
          transactions.length && options.length ?
            (<Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="dense">Date</TableCell>
                  <TableCell padding="dense">Type</TableCell>
                  <TableCell padding="dense">Description</TableCell>
                  <TableCell padding="dense">Amount</TableCell>
                  <TableCell padding="dense">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(transactions, (transaction, index) => (
                  <TableRow key={transaction.txid} selected={index % 2 === 0}>
                    <TableCell padding="dense">{getLocalDateTimeString(transaction.createdTime)}</TableCell>
                    <TableCell padding="dense">{transaction.type}</TableCell>
                    <TableCell padding="dense">{`#${transaction.optionIdx} ${options[transaction.optionIdx - 1]}`}</TableCell>
                    <TableCell padding="dense">{`${transaction.amount} ${transaction.token}`}</TableCell>
                    <TableCell padding="dense">{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>) :
            <Typography variant="body1">
              You do not have any transactions right now.
            </Typography>
        }
      </div>
    );
  }
}

PredictionTxHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(injectIntl(PredictionTxHistory));
