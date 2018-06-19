import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';

import styles from './styles';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';
import { localizeInvalidOption } from '../../../../helpers/localizeInvalidOption';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { TransactionType } from '../../../../constants';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventTxHistory extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
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
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(transactions, (transaction, index) => (
                this.renderTxRow(transaction, index)
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

  renderTxRow = (transaction) => {
    const { intl } = this.props;
    const { locale, messages: localeMessages } = intl;

    const result = [];
    result[0] = (
      <TableRow key={transaction.txid}>
        <TableCell padding="dense">{getShortLocalDateTimeString(transaction.createdTime)}</TableCell>
        <TableCell padding="dense">{getTxTypeString(transaction.type, locale, localeMessages)}</TableCell>
        <TableCell padding="dense">{this.getDescription(transaction)}</TableCell>
        <TableCell padding="dense">
          {!transaction.amount ? '' : `${transaction.amount} ${transaction.token}`}
        </TableCell>
        <TableCell padding="dense">{transaction.status}</TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${transaction.txid}`} selected>
        <TransactionHistoryAddress transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell />
      </TableRow>
    );
    result[2] = (
      <TableRow key={`txid-${transaction.txid}`} selected>
        <TransactionHistoryID transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell />
      </TableRow>
    );

    return result;
  };

  getDescription = (tx) => {
    const { optionIdx, topic } = tx;
    const { intl } = this.props;
    switch (tx.type) {
      case TransactionType.Bet:
      case TransactionType.ApproveSetResult:
      case TransactionType.SetResult:
      case TransactionType.ApproveVote:
      case TransactionType.Vote:
      case TransactionType.FinalizeResult: {
        if (optionIdx && topic) {
          const invalidOption = localizeInvalidOption(tx.topic.options[tx.optionIdx], intl);
          return `#${tx.optionIdx + 1} ${tx.topic.options[tx.optionIdx] === 'Invalid' ? invalidOption : tx.topic.options[tx.optionIdx]}`;
        }
        return '';
      }
      default: {
        return undefined;
      }
    }
  };
}
