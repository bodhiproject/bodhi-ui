import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';

import TxRow from './txRow';
import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventTxHistory extends Component {
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
        </Typography>
        {transactions.length && options.length ? (
          <Table>
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
                <TableCell padding="dense">
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(transactions, (transaction) => (
                <TxRow transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1">
            <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
          </Typography>
        )}
      </div>
    );
  }
}
