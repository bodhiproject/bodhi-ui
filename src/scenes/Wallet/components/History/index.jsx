import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

import styles from './styles';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import { TransactionType, SortBy } from '../../../../constants';
import Config from '../../../../config/app';
import { getShortLocalDateTimeString, decimalToSatoshi } from '../../../../helpers/utility';
import graphqlActions from '../../../../redux/Graphql/actions';

class WalletHistory extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.array,
    txReturn: PropTypes.object,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    transactions: [],
    txReturn: undefined,
  };

  state = {
    transactions: [],
    order: SortBy.Descending.toLowerCase(),
    orderBy: 'createdTime',
    perPage: 10,
    page: 0,
    limit: 50,
    skip: 0,
    selected: [],
  };

  componentWillMount() {
    this.getTransactions();
  }

  componentWillReceiveProps(nextProps) {
    const {
      transactions,
      txReturn,
      syncBlockNum,
    } = this.props;

    if ((txReturn && !nextProps.txReturn) || (syncBlockNum !== nextProps.syncBlockNum)) {
      this.getTransactions();
    }

    if (transactions || nextProps.transactions) {
      const sorted = _.orderBy(
        nextProps.transactions ? nextProps.transactions : transactions,
        [this.state.orderBy],
        [this.state.order],
      );

      this.setState({
        transactions: sorted,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { skip } = this.state;

    if (skip !== prevState.skip) {
      this.getTransactions();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transferHistory" defaultMessage="Transfer History" />
          </Typography>
          <Table className={classes.table}>
            {this.getTableHeader()}
            {this.getTableRows()}
            {this.getTableFooter()}
          </Table>
        </Grid>
      </Paper>
    );
  }

  getTransactions = () => {
    const { orderBy, order, limit, skip } = this.state;
    const direction = order === SortBy.Descending.toLowerCase() ? SortBy.Descending : SortBy.Ascending;

    this.props.getTransactions(
      [{ type: TransactionType.Transfer }],
      { field: orderBy, direction },
      limit,
      skip,
    );
  }

  getTableHeader = () => {
    const { order, orderBy } = this.state;

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
    ];

    return (
      <TableHead>
        <TableRow>
          {headerCols.map((column) => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
                enterDelay={Config.intervals.tooltipDelay}
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
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

  handleSorting = (property) => (event) => {
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

  getTableRows = () => {
    const { transactions } = this.state;

    return (
      <TableBody>
        {transactions.map((transaction, index) => (
          this.getTableRow(transaction, index)
        ))}
      </TableBody>
    );
  }


  handleClick = (id) => (event) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }
    this.setState({ selected: newSelected });
  };

  getTableRow = (transaction, index) => {
    const { classes } = this.props;
    const result = [];
    const isSelected = this.state.selected.includes(transaction.txid);
    result[0] = (
      <TableRow key={transaction.txid} selected={isSelected} onClick={this.handleClick(transaction.txid)} className={classes.clickToExpandRow}>
        <TableCell>
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
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${transaction.txid}`} selected onClick={this.handleClick(transaction.txid)} className={isSelected ? classes.show : classes.hide}>
        <TransactionHistoryAddress transaction={transaction} />
        <TableCell />
        <TransactionHistoryID transaction={transaction} />
        <TableCell /><TableCell /><TableCell />
      </TableRow>
    );

    return result;
  }

  getTableFooter = () => {
    const { transactions, perPage, page } = this.state;

    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={12}
            count={transactions.length}
            rowsPerPage={perPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangePerPage}
          />
        </TableRow>
      </TableFooter>
    );
  }

  handleChangePage = (event, page) => {
    const { transactions, perPage, skip } = this.state;

    // Set skip to fetch more txs if last page is reached
    let newSkip = skip;
    if (Math.floor(transactions.length / perPage) - 1 === page) {
      newSkip = transactions.length;
    }

    this.setState({ page, skip: newSkip });
  }

  handleChangePerPage = (event) => {
    this.setState({ perPage: event.target.value });
  }
}

const mapStateToProps = (state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  transactions: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (filters, orderBy, limit, skip) =>
      dispatch(graphqlActions.getTransactions(filters, orderBy, limit, skip)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(WalletHistory)));
