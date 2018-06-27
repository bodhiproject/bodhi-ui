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
import cx from 'classnames';

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

  state = {
    expanded: [],
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
    const { intl, classes } = this.props;
    const { locale, messages: localeMessages } = intl;
    const isExpanded = this.state.expanded.includes(transaction.txid);

    const result = [];
    result[0] = (
      <TableRow key={transaction.txid} onClick={this.handleClick(transaction.txid)}>
        <TableCell padding="dense">{getShortLocalDateTimeString(transaction.createdTime)}</TableCell>
        <TableCell padding="dense">{getTxTypeString(transaction.type, locale, localeMessages)}</TableCell>
        <TableCell padding="dense">{this.getDescription(transaction)}</TableCell>
        <TableCell padding="dense">
          {!transaction.amount ? '' : `${transaction.amount} ${transaction.token}`}
        </TableCell>
        <TableCell padding="dense">{transaction.status}</TableCell>
        <TableCell padding="dense"><i className={cx(isExpanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} /></TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${transaction.txid}`} onClick={this.handleClick(transaction.txid)} className={isExpanded ? classes.show : classes.hide} selected>
        <TransactionHistoryAddress transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
      </TableRow>
    );
    result[2] = (
      <TableRow key={`txid-${transaction.txid}`} onClick={this.handleClick(transaction.txid)} className={isExpanded ? classes.show : classes.hide} selected>
        <TransactionHistoryID transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
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

  handleClick = (id, topicAddress) => (event) => { // eslint-disable-line
    const { expanded } = this.state;
    const expandedIndex = expanded.indexOf(id);
    let newexpanded = [];
    if (expandedIndex === -1) {
      newexpanded = [...expanded, id];
    } else {
      newexpanded = [...expanded.slice(0, expandedIndex), ...expanded.slice(expandedIndex + 1)];
    }

    this.setState({ expanded: newexpanded });
  };
}
