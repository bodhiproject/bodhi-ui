import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
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
    const { transaction, intl } = this.props;
    const { optionIdx, topic, type } = transaction;
    switch (type) {
      case TransactionType.BET:
      case TransactionType.APPROVE_SET_RESULT:
      case TransactionType.SET_RESULT:
      case TransactionType.APPROVE_VOTE:
      case TransactionType.VOTE:
      case TransactionType.FINALIZE_RESULT: {
        if (optionIdx && topic) {
          const invalidOption = localizeInvalidOption(topic.options[optionIdx], intl);
          return `#${optionIdx + 1} ${topic.options[optionIdx] === 'Invalid' ? invalidOption : topic.options[optionIdx]}`;
        }
        return '';
      }
      default: {
        return undefined;
      }
    }
  }

  render() {
    const { classes, intl, transaction } = this.props;
    const { status, txid, createdTime, amount, token, type } = transaction;
    const { expanded } = this.state;

    return (
      <Fragment>
        <TableRow key={`tx-${txid}`} onClick={this.toggle}>
          <TableCell padding="dense">{getShortLocalDateTimeString(createdTime)}</TableCell>
          <TableCell padding="dense">{getTxTypeString(type, intl.locale, intl.messages)}</TableCell>
          <TableCell padding="dense">{this.name}</TableCell>
          <TableCell padding="dense">
            {!amount ? '' : `${amount} ${token}`}
          </TableCell>
          <TableCell padding="dense">{intl.formatMessage({ id: `str.${status.toLowerCase()}` })}</TableCell>
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
