import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import TxRow from './TxRow';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TransactionHistory extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
  };

  render() {
    const { options, store: { eventPage } } = this.props;
    const { transactions } = eventPage;
    return (
      <div>
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
              {transactions.map((transaction) => (
                <TxRow key={transaction.txid} transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <CenteredDiv>
            <Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>
          </CenteredDiv>
        )}
      </div>
    );
  }
}

export const CenteredDiv = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.centeredDiv} {...props} />
));
