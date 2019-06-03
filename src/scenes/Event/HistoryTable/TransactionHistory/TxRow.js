import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';
import { Token } from 'constants';

import styles from './styles';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { satoshiToDecimal, getTimeString } from '../../../../helpers/utility';

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

  render() {
    const { classes, intl, transaction } = this.props;
    const { txid, txType, txStatus, block, amount } = transaction;
    const { expanded } = this.state;
    const blockTime = block ? block.blockTime : messages.strPendingMsg;
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
          <TableCell>{block ? getTimeString(blockTime) : intl.formatMessage(blockTime)}</TableCell>
          <TableCell>{getTxTypeString(txType, intl)}</TableCell>
          <TableCell>{this.description}</TableCell>
          <TableCell>{!amount ? '' : `${satoshiToDecimal(amount)} ${Token.NBOT}`}</TableCell>
          <TableCell>{intl.formatMessage(statusMsg)}</TableCell>
          <TableCell>
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
