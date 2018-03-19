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
import _ from 'lodash';

import styles from './styles';
import { TransactionType } from '../../../../constants';
import Config from '../../../../config/app';
import { getShortLocalDateTimeString, decimalToSatoshi } from '../../../../helpers/utility';
import graphqlActions from '../../../../redux/Graphql/actions';

class WalletHistory extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getTransactions: PropTypes.func.isRequired,
    getTransactionsReturn: PropTypes.array,
    txReturn: PropTypes.object,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    getTransactionsReturn: [],
    txReturn: undefined,
  };

  state = {
    data: [],
    order: 'desc',
    orderBy: 'createdTime',
  };

  componentWillMount() {
    this.getTransactions();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTransactionsReturn,
      txReturn,
      syncBlockNum,
    } = this.props;

    if ((txReturn && !nextProps.txReturn) || (syncBlockNum !== nextProps.syncBlockNum)) {
      this.getTransactions();
    }

    if (getTransactionsReturn || nextProps.getTransactionsReturn) {
      const sorted = _.orderBy(
        nextProps.getTransactionsReturn ? nextProps.getTransactionsReturn : getTransactionsReturn,
        [this.state.orderBy],
        [this.state.order],
      );

      this.setState({
        data: sorted,
      });
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
          </Table>
        </Grid>
      </Paper>
    );
  }

  getTransactions = () => {
    this.props.getTransactions([
      { type: TransactionType.Transfer },
    ]);
  };

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
  };

  handleSorting = (property) => (event) => {
    const { data } = this.state;

    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const sorted = _.orderBy(data, [orderBy], [order]);

    this.setState({
      data: sorted,
      orderBy,
      order,
    });
  };

  getTableRows = () => {
    const { data } = this.state;

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
              {item.receiverAddress}
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

const mapStateToProps = (state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(WalletHistory)));
