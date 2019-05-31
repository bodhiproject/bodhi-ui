import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ResponsiveTable } from 'components';
import styles from './styles';
import TxRow from './TxRow';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TransactionHistory extends Component {
  render() {
    const { store: { eventPage, naka }, myTransactions } = this.props;
    const { transactionHistoryItems, event } = eventPage;

    return (
      <div>
        {transactionHistoryItems.length ? (
          <ResponsiveTable>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="str.date" defaultMessage="Date" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="str.type" defaultMessage="Type" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="str.description" defaultMessage="Description" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="str.amount" defaultMessage="Amount" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="str.status" defaultMessage="Status" />
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionHistoryItems.map((transaction) => (
                (!myTransactions || (myTransactions && naka.account.toLowerCase() === transaction.txReceipt.from)) && <TxRow key={transaction.txid} transaction={transaction} event={event} />
              ))}
            </TableBody>
          </ResponsiveTable>
        ) : (
          <CenteredDiv>
            <Typography variant="body2">
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
