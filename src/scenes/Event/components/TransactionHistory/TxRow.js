import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';

import styles from './styles';
import { getTxTypeString } from '../../../../helpers/stringUtil';

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
    const { intl, transaction: { optionIdx, topic, localizedInvalid } } = this.props;
    if (topic && optionIdx) {
      const optionName = topic.options[optionIdx];
      return `#${optionIdx + 1} ${optionName === 'Invalid' && !localizedInvalid
        ? localizedInvalid.parse(intl.locale)
        : optionName}`;
    }
    return '';
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, intl, transaction } = this.props;
    const { status, txid, createdTime, amount, token, type } = transaction;
    const { expanded } = this.state;

    const statusMsg = (() => {
      switch (status) {
        case 'PENDING': return messages.strPendingMsg;
        case 'SUCCESS': return messages.strSuccessMsg;
        default: return messages.strFailMsg;
      }
    })();

    return (
      <Fragment>
        <TableRow key={`tx-${txid}`}>
          <TableCell padding="dense">{moment.unix(createdTime).format('LLL')}</TableCell>
          <TableCell padding="dense">{getTxTypeString(type, intl)}</TableCell>
          <TableCell padding="dense">{this.description}</TableCell>
          <TableCell padding="dense">{!amount ? '' : `${amount} ${token}`}</TableCell>
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
              <TransactionHistoryID transaction={transaction} />
              <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
            </TableRow>
            <TableRow selected key={`txid-${txid}`}>
              <TransactionHistoryAddress transaction={transaction} />
              <TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
            </TableRow>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
