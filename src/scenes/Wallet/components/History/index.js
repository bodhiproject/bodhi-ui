import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import {
  Table,
  Paper,
  Grid,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import cx from 'classnames';

import styles from './styles';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import { TransactionType, SortBy } from '../../../../constants';
import Config from '../../../../config/app';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';
import graphqlActions from '../../../../redux/Graphql/actions';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  txReturn: state.Graphql.get('txReturn'),
}))
@inject('store')
@observer
export default class WalletHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    txReturn: PropTypes.object,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    txReturn: undefined,
  };

  componentDidMount() {
    this.props.store.walletHistory.getTransactions();
  }

  componentWillReceiveProps(nextProps) {
    const { txReturn, syncBlockNum, store: { walletHistory: { getTransactions } } } = this.props;

    if ((txReturn && !nextProps.txReturn) || (syncBlockNum !== nextProps.syncBlockNum)) {
      getTransactions();
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { skip } = this.state;

  //   if (skip !== prevState.skip) {
  //     this.getTransactions();
  //   }
  // }

  render() {
    const { classes, store: { walletHistory: { list } } } = this.props;
    console.log(list.length);

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transferHistory" defaultMessage="Transfer History" />
          </Typography>
          <Table className={classes.table}>
            {this.getTableHeader()}
            {this.getTableRows(list)}
            {this.getTableFooter()}
          </Table>
        </Grid>
      </Paper>
    );
  }

  getTableHeader = () => {
    const { orderBy, direction } = this.props.store.walletHistory;

    const headerCols = [
      {
        id: 'createdTime',
        name: 'str.time',
        nameDefault: 'Time',
        numeric: false,
      },
      {
        id: 'senderAddress',
        name: 'str.from',
        nameDefault: 'From',
        numeric: false,
      },
      {
        id: 'receiverAddress',
        name: 'str.to',
        nameDefault: 'To',
        numeric: false,
      },
      {
        id: 'amount',
        name: 'str.amount',
        nameDefault: 'Amount',
        numeric: true,
      },
      {
        id: 'fee',
        name: 'str.fee',
        nameDefault: 'Gas Fee(QTUM)',
        numeric: true,
      },
      {
        id: 'status',
        name: 'str.status',
        nameDefault: 'Status',
        numeric: false,
      },
      {
        id: 'actions',
        name: 'str.empty',
        nameDefault: '',
        numeric: false,
        sortable: false,
      },
    ];

    return (
      <TableHead>
        <TableRow>
          {headerCols.map((column) => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              sortDirection={orderBy === column.id ? direction.toLowerCase() : false}
            >
              <Tooltip
                title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
                enterDelay={Config.intervals.tooltipDelay}
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={direction.toLowerCase()}
                  onClick={this.handleSorting(column.id)}
                >
                  <FormattedMessage id={column.name} default={column.nameDefault} />
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  handleSorting = (property) => (event) => { // eslint-disable-line
    const { transactions } = this.state;

    const orderBy = property;
    let order = SortBy.Descending.toLowerCase();

    if (this.state.orderBy === property && this.state.order === SortBy.Descending.toLowerCase()) {
      order = SortBy.Ascending.toLowerCase();
    }

    const sorted = _.orderBy(transactions, [orderBy], [order]);

    this.setState({
      transactions: sorted,
      orderBy,
      order,
    });
  }

  getTableRows = (transactions) => (
    <TableBody>
      {transactions.map((transaction, index) => (
        this.getTableRow(transaction, index)
      ))}
    </TableBody>
  );


  handleClick = (id) => (event) => { // eslint-disable-line
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

  getTableRow = (transaction) => {
    const { classes } = this.props;
    const result = [];
    const isExpanded = this.state.expanded.includes(transaction.txid);
    result[0] = (
      <TableRow key={transaction.txid} selected={isExpanded} onClick={this.handleClick(transaction.txid)} className={classes.clickToExpandRow}>
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
          {`${transaction.amount || ''}  ${transaction.amount ? transaction.token : ''}`}
        </TableCell>
        <TableCell numeric>
          {transaction.fee}
        </TableCell>
        <TableCell>
          {transaction.status}
        </TableCell>
        <TableCell>
          <i className={cx(isExpanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} />
        </TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${transaction.txid}`} selected onClick={this.handleClick(transaction.txid)} className={isExpanded ? classes.show : classes.hide}>
        <TransactionHistoryAddress transaction={transaction} />
        <TableCell />
        <TransactionHistoryID transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell />
      </TableRow>
    );

    return result;
  }

  getTableFooter = () => {
    const { list, perPage, page, onPageChange, onPerPageChange } = this.props.store.walletHistory;

    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={12}
            count={list.length}
            rowsPerPage={perPage}
            page={page}
            onChangePage={onPageChange}
            onChangeRowsPerPage={onPerPageChange}
          />
        </TableRow>
      </TableFooter>
    );
  }
}
