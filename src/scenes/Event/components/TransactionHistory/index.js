import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ResponsiveTable } from 'components';

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
    const { options, store: { eventPage, wallet } } = this.props;
    const { transactionHistoryItems, topic } = eventPage;
    return (
      <div>
        {transactionHistoryItems.length && options.length ? (
          <ResponsiveTable>
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
              {transactionHistoryItems.map((transaction) => (
                (!(this.props.myTransactions && (wallet.addresses.findIndex(x => x.address === transaction.senderAddress) === -1))) && <TxRow key={transaction.txid} transaction={transaction} topic={topic} />
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
