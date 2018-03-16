import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import styles from './styles';
import { getLocalDateTimeString } from '../../../../helpers/utility';
import { TransactionType } from '../../../../constants';

class EventTxHistory extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
  };

  render() {
    const { classes, transactions, options } = this.props;

    return (
      <div className={classes.detailTxWrapper}>
        <Typography variant="headline" className={classes.detailTxTitle}>
          <FormattedMessage id="str.transaction" defaultMessage="TRANSACTIONS" />
        </Typography> {
          transactions.length && options.length ?
            (<Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="dense">
                    <FormattedMessage id="str.date" defaultMessage="Date" />
                  </TableCell>
                  <TableCell padding="dense">
                    <FormattedMessage id="str.type" defaultMessage="Type" />
                  </TableCell>
                  <TableCell padding="dense">
                    <FormattedMessage id="str.description" defaultMessage="Description" />
                  </TableCell>
                  <TableCell padding="dense">
                    <FormattedMessage id="str.amount" defaultMessage="Amount" />
                  </TableCell>
                  <TableCell padding="dense">
                    <FormattedMessage id="str.status" defaultMessage="Status" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(transactions, (transaction, index) => (
                  <TableRow key={transaction.txid} selected={index % 2 === 1}>
                    <TableCell padding="dense">{getLocalDateTimeString(transaction.createdTime)}</TableCell>
                    <TableCell padding="dense">{transaction.type}</TableCell>
                    <TableCell padding="dense">{this.getDescription(transaction)}</TableCell>
                    <TableCell padding="dense">
                      {transaction.amount === null ? null : `${transaction.amount} ${transaction.token}`}
                    </TableCell>
                    <TableCell padding="dense">{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>) :
            <Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>
        }
      </div>
    );
  }

  getDescription = (tx) => {
    switch (tx.type) {
      case TransactionType.Bet:
      case TransactionType.ApproveSetResult:
      case TransactionType.SetResult:
      case TransactionType.ApproveVote:
      case TransactionType.Vote:
      case TransactionType.FinalizeResult: {
        return `#${tx.optionIdx + 1} ${tx.topic.options[tx.optionIdx]}`;
      }
      default: {
        return undefined;
      }
    }
  };
}

export default withStyles(styles, { withTheme: true })(injectIntl(EventTxHistory));
