import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';
import { getTxTypeString } from '../../../../helpers/stringUtil';

const messages = defineMessages({
  invalidMsg: {
    id: 'invalid',
    defaultMessage: 'Invalid',
  },
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

  toggle = () => {
    // TODO: probably need some logic here for not expanding when clicking on
    // the Name link field
    this.setState({ expanded: !this.state.expanded });
  };

  get name() {
    const { intl: { formatMessage }, transaction: { optionIdx, topic, name } } = this.props;
    if (topic) {
      return `#${optionIdx + 1} ${name === 'Invalid' ? formatMessage(messages.invalidMsg) : name}`;
    }
    return '';
  }

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
        <TableRow key={`tx-${txid}`} onClick={this.toggle}>
          <TableCell padding="dense">{getShortLocalDateTimeString(createdTime)}</TableCell>
          <TableCell padding="dense">{getTxTypeString(type, intl.locale, intl.messages)}</TableCell>
          <TableCell padding="dense">{this.name}</TableCell>
          <TableCell padding="dense">
            {!amount ? '' : `${amount} ${token}`}
          </TableCell>
          <TableCell padding="dense">{intl.formatMessage(statusMsg)}</TableCell>
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
