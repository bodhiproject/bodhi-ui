import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import Config from '../../../../config/app';
import graphqlActions from '../../../../redux/Graphql/actions';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';

class EventHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'time',
      transactions: [],
    };

    this.getTableHeader = this.getTableHeader.bind(this);
    this.getTableRows = this.getTableRows.bind(this);
    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
    this.executeTxsRequest = this.executeTxsRequest.bind(this);
  }

  componentWillMount() {
    this.executeTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTransactionsReturn,
      syncBlockTime,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeTxsRequest();
    }

    this.setState({ transactions: getTransactionsReturn });
  }

  render() {
    const { transactions } = this.state;

    return (
      <Grid container spacing={0}>
        {
          transactions.length ?
            (<Table>
              {this.getTableHeader()}
              {this.getTableRows(this.state.transactions)}
            </Table>) :
            (<Typography variant="body1">
              You do not have any transactions right now.
            </Typography>)
        }
      </Grid>
    );
  }

  executeTxsRequest() {
    this.props.getTransactions([], undefined);
  }

  getTableHeader() {
    const { order, orderBy } = this.state;

    const headerCols = [
      {
        id: 'time',
        name: 'str.time',
        nameDefault: 'Time',
        numeric: false,
      },
      {
        id: 'type',
        name: 'str.type',
        nameDefault: 'Type',
        numeric: false,
      },
      {
        id: 'name',
        name: 'str.name',
        nameDefault: 'Name',
        numeric: false,
      },
      {
        id: 'token',
        name: 'str.token',
        nameDefault: 'Token',
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
        nameDefault: 'Fee',
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
        name: 'str.actions',
        nameDefault: 'Actions',
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
                title={<FormattedMessage id="str.sort" default="Sort" />}
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
          ))}
        </TableRow>
      </TableHead>
    );
  }

  getTableRows(transactions) {
    const { classes } = this.props;

    return (
      <TableBody>
        {_.map(transactions, (transaction, index) => (
          transaction.topic ?
            <TableRow key={transaction.txid} selected={index % 2 === 1}>
              <TableCell>
                {getShortLocalDateTimeString(transaction.createdTime)}
              </TableCell>
              <TableCell>
                {transaction.type}
              </TableCell>
              <TableCell>
                {transaction.topic ? transaction.topic.name : null}
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
                {transaction.status}
              </TableCell>
              <TableCell>
                <Link to={this.getEventURL(transaction.topic.address, transaction.oracleAddress)} className={classes.viewEventLink}>
                  <FormattedMessage id="eventHistory.viewEvent" default="View Event" />
                </Link>
              </TableCell>
            </TableRow> : null
        ))}
      </TableBody>
    );
  }

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const transactions = order === 'desc'
      ? this.state.transactions.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.transactions.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ transactions, order, orderBy });
  }

  getEventURL(topicAddress, oracleAddress) {
    // TODO: NEED TO REROUTE TO TOPIC PAGE IS ITS IN WITHDRAW STATUS
    return `/oracle/${topicAddress}/${oracleAddress}`;
  }
}

EventHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  getTransactions: PropTypes.func,
  getTransactionsReturn: PropTypes.array,
  syncBlockTime: PropTypes.number,
};

EventHistory.defaultProps = {
  getTransactions: undefined,
  getTransactionsReturn: [],
  syncBlockTime: undefined,
};

const mapStateToProps = (state) => ({
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(EventHistory)));
