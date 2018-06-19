import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  Typography,
  Table,
  Grid,
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
import cx from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import Config from '../../../../config/app';
import TransactionHistoryID from '../../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../../components/TransactionHistoryAddressAndID/address';
import graphqlActions from '../../../../redux/Graphql/actions';
import { getShortLocalDateTimeString, getDetailPagePath } from '../../../../helpers/utility';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { TransactionType, SortBy, AppLocation } from '../../../../constants';


const messages = defineMessages({ // eslint-disable-line
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


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  oracles: state.Graphql.get('getOraclesReturn'),
  transactions: state.Graphql.get('getTransactionsReturn'),
}), (dispatch) => ({
  getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
  getTransactions: (filters, orderBy, limit, skip) =>
    dispatch(graphqlActions.getTransactions(filters, orderBy, limit, skip)),
}))
@inject('store')
@observer
export default class EventHistory extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getOracles: PropTypes.func.isRequired,
    oracles: PropTypes.array,
    getTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.array,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    oracles: undefined,
    transactions: undefined,
  };

  state = {
    transactions: [],
    order: SortBy.Descending.toLowerCase(),
    orderBy: 'createdTime',
    perPage: 10,
    page: 0,
    limit: 50,
    skip: 0,
    expanded: [],
  };

  navigating = false

  componentDidMount() {
    this.props.store.ui.location = AppLocation.activityHistory;
    this.executeTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const { transactions, syncBlockNum } = this.props;

    // Update page on new block
    if (nextProps.syncBlockNum !== syncBlockNum) {
      this.executeTxsRequest();
    }

    if (nextProps.transactions || transactions) {
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
    const { oracles, history } = this.props;

    if (skip !== prevState.skip) {
      this.executeTxsRequest();
    }

    if (prevProps.oracles !== oracles && this.navigating) {
      const path = getDetailPagePath(oracles);
      if (path) history.push(path);
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
    const { orderBy, order, limit, skip } = this.state;
    const direction = order === SortBy.Descending.toLowerCase() ? SortBy.Descending : SortBy.Ascending;

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
      { field: orderBy, direction },
      limit,
      skip,
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
        id: 'amount',
        name: 'str.amount',
        nameDefault: 'Amount',
        numeric: true,
        sortable: true,
      },
      {
        id: 'fee',
        name: 'str.fee',
        nameDefault: 'Gas Fee (QTUM)',
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
        name: 'str.empty',
        nameDefault: '',
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
    const { transactions, page, perPage } = this.state;
    const slicedTxs = _.slice(transactions, page * perPage, (page * perPage) + perPage);

    return (
      <TableBody>
        {_.map(slicedTxs, (transaction, index) => (
          this.getTableRow(transaction, index)
        ))}
      </TableBody>
    );
  }

  handleClick = (id, topicAddress) => (event) => { // eslint-disable-line
    const { expanded } = this.state;
    const expandedIndex = expanded.indexOf(id);
    let newexpanded = [];
    if (topicAddress) {
      this.props.getOracles(
        [
          { topicAddress },
        ],
        { field: 'endTime', direction: SortBy.Descending },
      );
      this.navigating = true;
    } else if (expandedIndex === -1) {
      newexpanded = [...expanded, id];
    } else {
      newexpanded = [...expanded.slice(0, expandedIndex), ...expanded.slice(expandedIndex + 1)];
    }

    this.setState({ expanded: newexpanded });
  };

  getTableRow = (transaction) => {
    const { name, topic, type, txid, amount, token, fee, status, createdTime } = transaction;
    const { intl, classes } = this.props;
    const { locale, messages: localeMessages } = intl;
    const result = [];
    const isExpanded = this.state.expanded.includes(txid);

    result[0] = (
      <TableRow key={txid} selected={isExpanded} onClick={this.handleClick(txid)} className={classes.clickToExpandRow} >
        <TableCell className={classes.summaryRowCell}>
          {getShortLocalDateTimeString(createdTime)}
        </TableCell>
        <TableCell>
          {getTxTypeString(type, locale, localeMessages)}
        </TableCell>
        <NameLinkCell clickable={topic && topic.address} onClick={this.handleClick(txid, topic && topic.address)}>
          {name || (topic && topic.name)}
        </NameLinkCell>
        <TableCell numeric>
          {`${amount || ''}  ${amount ? token : ''}`}
        </TableCell>
        <TableCell numeric>
          {fee}
        </TableCell>
        <TableCell>
          <FormattedMessage id={`str.${status}`.toLowerCase()}>
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </TableCell>
        <TableCell>
          <i className={cx(isExpanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} />
        </TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${txid}`} selected onClick={this.handleClick(txid)} className={isExpanded ? classes.show : classes.hide}>
        <TransactionHistoryAddress transaction={transaction} className={classes.detailRow} />
        <TableCell /><TransactionHistoryID transaction={transaction} />
        <TableCell />
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
    this.setState({ expanded: [] });
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

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  }

  handleSorting = (event, property) => {
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
}

const NameLinkCell = withStyles(styles)(({ classes, clickable, topic, ...props }) => (
  <TableCell>
    <span className={clickable && classes.viewEventLink} {...props} />
  </TableCell>
));
