import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  TableCell,
  TableRow,
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
export default class TxRow extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    transaction: PropTypes.array.isRequired,
  };

  state = {
    expanded: false,
  }

  toggle = () => {
    // probably need some logic here for not expanding when clicking on
    // the Name link field
    this.setState({ expanded: !this.state.expanded });
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

  render() {
    const { transaction, classes, intl: { locale, localeMessages } } = this.props;
    const { txid, createdTime, amount, token, type, status } = transaction;
    const { expanded } = this.state;

    return (
      <Fragment>
        <TableRow key={`tx-${txid}`} onClick={this.toggle}>
          <TableCell padding="dense">{getShortLocalDateTimeString(createdTime)}</TableCell>
          <TableCell padding="dense">{getTxTypeString(type, locale, localeMessages)}</TableCell>
          <TableCell padding="dense">{this.getDescription(transaction)}</TableCell>
          <TableCell padding="dense">
            {!amount ? '' : `${amount} ${token}`}
          </TableCell>
          <TableCell padding="dense">{status}</TableCell>
          <TableCell padding="dense"><i className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} /></TableCell>
        </TableRow>
        {expanded && (
          <Fragment>
            <TableRow selected onClick={this.toggle} key={`txaddr-${txid}`}>
              <TransactionHistoryID transaction={transaction} />
              <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
            </TableRow>
            <TableRow selected onClick={this.toggle} key={`txid-${txid}`}>
              <TransactionHistoryAddress transaction={transaction} />
              <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
            </TableRow>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
