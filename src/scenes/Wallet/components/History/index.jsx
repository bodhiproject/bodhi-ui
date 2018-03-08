import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import { TransactionType } from '../../../../constants';
import Config from '../../../../config/app';
import { getShortLocalDateTimeString, decimalToSatoshi } from '../../../../helpers/utility';
import graphqlActions from '../../../../redux/Graphql/actions';

class WalletHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'time',
    };

    this.getTableHeader = this.getTableHeader.bind(this);
    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
  }

  componentWillMount() {
    this.props.getTransactions([
      { type: TransactionType.Transfer },
    ]);
  }

  render() {
    const { classes, getTransactionsReturn } = this.props;

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transferHistory" defaultMessage="Transaction History" />
          </Typography>
          <Table className={classes.table}>
            {this.getTableHeader()}
            {this.getTableRows(getTransactionsReturn)}
          </Table>
        </Grid>
      </Paper>
    );
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
        id: 'from',
        name: 'str.from',
        nameDefault: 'From',
        numeric: false,
      },
      {
        id: 'to',
        name: 'str.to',
        nameDefault: 'To',
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

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting(event, property) {
    const { getTransactionsReturn } = this.props;

    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data = order === 'desc'
      ? getTransactionsReturn.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : getTransactionsReturn.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({
      order,
      orderBy,
    });
  }

  getTableRows(data) {
    return (
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.txid}>
            <TableCell>
              {getShortLocalDateTimeString(item.blockTime ? item.blockTime : item.createdTime)}
            </TableCell>
            <TableCell>
              {item.senderAddress}
            </TableCell>
            <TableCell>
              {item.to}
            </TableCell>
            <TableCell>
              {item.token}
            </TableCell>
            <TableCell numeric>
              {item.amount}
            </TableCell>
            <TableCell numeric>
              {item.fee}
            </TableCell>
            <TableCell>
              {item.status}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }
}

WalletHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  getTransactions: PropTypes.func.isRequired,
  getTransactionsReturn: PropTypes.array,
};

WalletHistory.defaultProps = {
  getTransactionsReturn: [],
};

const mapStateToProps = (state) => ({
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(WalletHistory)));
