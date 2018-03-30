import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import Config from '../../../../config/app';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import appActions from '../../../../redux/App/actions';
import graphqlActions from '../../../../redux/Graphql/actions';
import { getShortLocalDateTimeString, getDetailPagePath } from '../../../../helpers/utility';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { TransactionType, SortBy, OracleStatus, AppLocation } from '../../../../constants';

const messages = defineMessages({
  statusSuccess: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  statusPending: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  statusFail: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
});

class EventHistory extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    setAppLocation: PropTypes.func.isRequired,
    getOracles: PropTypes.func.isRequired,
    getOraclesReturn: PropTypes.object,
    getTransactions: PropTypes.func,
    getTransactionsReturn: PropTypes.array,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    getOraclesReturn: undefined,
    getTransactions: undefined,
    getTransactionsReturn: [],
  };

  state = {
    transactions: [],
    order: 'desc',
    orderBy: 'createdTime',
    perPage: 10,
    page: 0,
  };

  componentWillMount() {
    const { setAppLocation } = this.props;

    setAppLocation(AppLocation.activityHistory);
    this.executeTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesReturn,
      getTransactionsReturn,
      syncBlockNum,
    } = nextProps;

    // return from the click event
    if (getOraclesReturn !== this.props.getOraclesReturn) {
      const path = getDetailPagePath(getOraclesReturn.data);
      if (path) {
        this.props.history.push(path);
      }
    }

    // Update page on new block
    if (syncBlockNum !== this.props.syncBlockNum) {
      this.executeTxsRequest();
    }

    if (getTransactionsReturn || nextProps.getTransactionsReturn) {
      const sorted = _.orderBy(
        nextProps.getTransactionsReturn ? nextProps.getTransactionsReturn : getTransactionsReturn,
        [this.state.orderBy],
        [this.state.order],
      );

      this.setState({
        transactions: sorted,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { transactions } = this.state;

    return (
      <Grid container spacing={0}>
        {
          transactions.length ?
            (<Table className={classes.historyTable}>
              {this.getTableHeader()}
              {this.getTableRows()}
              {this.getTableFooter()}
            </Table>) :
            (<Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>)
        }
      </Grid>
    );
  }

  executeTxsRequest = () => {
    this.props.getTransactions(
      [
        { type: TransactionType.ApproveCreateEvent },
        { type: TransactionType.CreateEvent },
        { type: TransactionType.Bet },
        { type: TransactionType.ApproveSetResult },
        { type: TransactionType.SetResult },
        { type: TransactionType.ApproveVote },
        { type: TransactionType.Vote },
        { type: TransactionType.FinalizeResult },
        { type: TransactionType.Withdraw },
        { type: TransactionType.WithdrawEscrow },
        { type: TransactionType.ResetApprove },
      ],
      undefined
    );
  }

  getTableHeader = () => {
    const headerCols = [
      {
        id: 'createdTime',
        name: 'str.time',
        nameDefault: 'Time',
        numeric: false,
        sortable: true,
      },
      {
        id: 'type',
        name: 'str.type',
        nameDefault: 'Type',
        numeric: false,
        sortable: true,
      },
      {
        id: 'name',
        name: 'str.name',
        nameDefault: 'Name',
        numeric: false,
        sortable: false,
      },
      {
        id: 'token',
        name: 'str.token',
        nameDefault: 'Token',
        numeric: false,
        sortable: true,
      },
      {
        id: 'amount',
        name: 'str.amount',
        nameDefault: 'Amount',
        numeric: true,
        sortable: true,
      },
      {
        id: 'fee',
        name: 'str.fee',
        nameDefault: 'Fee',
        numeric: true,
        sortable: true,
      },
      {
        id: 'status',
        name: 'str.status',
        nameDefault: 'Status',
        numeric: false,
        sortable: true,
      },
      {
        id: 'actions',
        name: 'str.actions',
        nameDefault: 'Actions',
        numeric: false,
        sortable: false,
      },
    ];

    return (
      <TableHead>
        <TableRow>
          {headerCols.map((column) => column.sortable ? this.getSortableCell(column) : this.getNonSortableCell(column))}
        </TableRow>
      </TableHead>
    );
  }

  getSortableCell = (column) => {
    const { order, orderBy } = this.state;
    return (
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
            onClick={this.createSortHandler(column.id)}
          >
            <FormattedMessage id={column.name} default={column.nameDefault} />
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    );
  }

  getNonSortableCell = (column) => (
    <TableCell key={column.id} numeric={column.numeric}>
      <FormattedMessage id={column.name} default={column.nameDefault} />
    </TableCell>
  )

  getTableRows = () => {
    const { classes } = this.props;
    const { transactions } = this.state;

    return (
      <TableBody>
        {_.map(transactions, (transaction, index) => (
          this.getTableRow(transaction, index)
        ))}
      </TableBody>
    );
  }

  getTableRow = (transaction, index) => {
    const { intl, classes } = this.props;
    const { locale, messages: localeMessages } = intl;
    const result = [];

    result[0] = (
      <TableRow key={transaction.txid}>
        <TableCell>
          {getShortLocalDateTimeString(transaction.createdTime)}
        </TableCell>
        <TableCell>
          {getTxTypeString(transaction.type, locale, localeMessages)}
        </TableCell>
        <TableCell>
          {transaction.name ? transaction.name : (transaction.topic && transaction.topic.name)}
        </TableCell>
        <TableCell>
          {transaction.token}
        </TableCell>
        <TableCell numeric>
          {transaction.amount}
        </TableCell>
        <TableCell numeric>
          {transaction.fee}
        </TableCell>
        <TableCell>
          <FormattedMessage id={`str.${transaction.status}`.toLowerCase()}>
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </TableCell>
        <TableCell>
          {transaction.topic && transaction.topic.address ?
            <div
              data-topic-address={transaction.topic.address}
              onClick={this.onEventLinkClicked}
              className={classes.viewEventLink}
            >
              <FormattedMessage id="eventHistory.viewEvent" defaultMessage="View Event" />
            </div> : null
          }
        </TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${transaction.txid}`} selected>
        <TransactionHistoryAddress transaction={transaction} />
        <TableCell /><TableCell />
        <TransactionHistoryID transaction={transaction} />
        <TableCell /><TableCell /><TableCell /><TableCell />
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
    this.setState({ page });
  }

  handleChangePerPage = (event) => {
    this.setState({ perPage: event.target.value });
  }

  onEventLinkClicked = (event) => {
    const {
      getOracles,
    } = this.props;

    const topicAddress = event.currentTarget.getAttribute('data-topic-address');
    getOracles(
      [
        { topicAddress },
      ],
      { field: 'endTime', direction: SortBy.Descending },
    );
  };

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting = (event, property) => {
    const { transactions } = this.state;

    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const sorted = _.orderBy(transactions, [orderBy], [order]);

    this.setState({
      transactions: sorted,
      orderBy,
      order,
    });
  }
}

const mapStateToProps = (state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(EventHistory)));
