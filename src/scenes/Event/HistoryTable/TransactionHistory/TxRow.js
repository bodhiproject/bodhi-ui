import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';
import { Token, TransactionType } from 'constants';

import styles from './styles';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { stringToBN, satoshiToDecimal } from '../../../../helpers/utility';

const messages = defineMessages({
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  strSuccessMsg: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  strFailMsg: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
export default class TxRow extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
  };

  state = {
    expanded: false,
  }

  get description() {
    const { intl, transaction: { resultIndex, resultName }, event } = this.props;
    if (resultIndex !== null && resultIndex !== undefined) {
      return `#${resultIndex} ${resultIndex === 0 ?
        event.localizedInvalid.parse(intl.locale) : resultName}`;
    }
    return '';
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  getAmount = (transaction) => {
    const { txType } = transaction;
    let { amount } = transaction;
    if (txType === TransactionType.CREATE_EVENT) {
      amount = transaction.escrowAmount;
    } else if (txType === TransactionType.WITHDRAW) {
      amount = stringToBN(transaction.winningAmount) + stringToBN(transaction.escrowWithdrawAmount);
      amount = amount.toString();
    }

    return satoshiToDecimal(amount);
  }

  render() {
    const { classes, intl, transaction } = this.props;
    const { txid, txType, txStatus, block: { blockTime: createdTime } } = transaction;
    const { expanded } = this.state;
    const amount = this.getAmount(transaction);
    const statusMsg = (() => {
      switch (txStatus) {
        case 'PENDING': return messages.strPendingMsg;
        case 'SUCCESS': return messages.strSuccessMsg;
        default: return messages.strFailMsg;
      }
    })();

    return (
      <Fragment>
        <TableRow key={`tx-${txid}`}>
          <TableCell padding="dense">{moment.unix(createdTime).format('LLL')}</TableCell>
          <TableCell padding="dense">{getTxTypeString(txType, intl)}</TableCell>
          <TableCell padding="dense">{this.description}</TableCell>
          <TableCell padding="dense">{!amount ? '' : `${amount} ${Token.NBOT}`}</TableCell>
          <TableCell padding="dense">{intl.formatMessage(statusMsg)}</TableCell>
          <TableCell padding="dense">
            <i
              className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)}
              onClick={this.toggle}
            />
          </TableCell>
        </TableRow>
        {expanded && (
          <Fragment>
            <TableRow selected key={`txaddr-${txid}`}>
              <TransactionHistoryID colSpan={3} transaction={transaction} />
              <TransactionHistoryAddress colSpan={3} transaction={transaction} />
            </TableRow>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
