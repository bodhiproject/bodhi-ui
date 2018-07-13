import React, { Component, Fragment } from 'react';
import { TableCell, TableRow, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../../../../../helpers/utility';
import TransactionHistoryID from '../../../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../../../components/TransactionHistoryAddressAndID/address';

export default class HistoryItem extends Component {
  state = {
    expanded: false,
  }

  onRowClick = () => this.setState({ expanded: !this.state.expanded })

  render() {
    const { transaction } = this.props;
    const { expanded } = this.state;

    return (
      <Fragment>
        <MainRow transaction={transaction} expanded={expanded} onRowClick={this.onRowClick} />
        <SecondaryRow transaction={transaction} expanded={expanded} />
      </Fragment>
    );
  }
}

const MainRow = withStyles(styles)(({ classes, transaction, expanded, onRowClick }) => (
  <TableRow key={transaction.txid} selected={expanded}>
    <TableCell className={classes.summaryRowCell}>
      {getShortLocalDateTimeString(transaction.blockTime ? transaction.blockTime : transaction.createdTime)}
    </TableCell>
    <TableCell>
      {transaction.senderAddress}
    </TableCell>
    <TableCell>
      {transaction.receiverAddress}
    </TableCell>
    <TableCell numeric>
      <b>{`${moneyNum(transaction.amount) || ''}  ${transaction.amount ? transaction.token : ''}`}</b>
    </TableCell>
    <TableCell numeric>
      {transaction.fee}
    </TableCell>
    <TableCell>
      {transaction.status}
    </TableCell>
    <TableCell>
      <i
        className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)}
        onClick={onRowClick}
      />
    </TableCell>
  </TableRow>
));

const SecondaryRow = withStyles(styles)(({ classes, transaction, expanded }) => (
  <TableRow key={`txaddr-${transaction.txid}`} selected className={expanded ? classes.show : classes.hide}>
    <TransactionHistoryAddress transaction={transaction} />
    <TableCell />
    <TransactionHistoryID transaction={transaction} />
    <TableCell /><TableCell /><TableCell /><TableCell />
  </TableRow>
));

const moneyNum = (num) => (Math.floor(Number(num) * 100000) / 100000).toFixed(6); // eslint-disable-line
