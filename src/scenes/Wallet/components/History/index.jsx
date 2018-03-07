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
import Config from '../../../../config/app';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';

const mockData = [
  {
    txid: 1,
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 1,
    fee: 0.1,
    status: 'Pending',
  },
  {
    txid: 2,
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3',
    token: 'QTUM',
    amount: 2,
    fee: 0.2,
    status: 'Pending',
  },
  {
    txid: 3,
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qbyAYsQQf7U4seauDv9cYjwfiNrR9fJz3R',
    token: 'QTUM',
    amount: 3,
    fee: 0.3,
    status: 'Pending',
  },
  {
    txid: 4,
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qW254UF54ApahzucGAmMsG559zZwNYU4Hx',
    token: 'QTUM',
    amount: 4,
    fee: 0.4,
    status: 'Pending',
  },
];

class WalletHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'time',
      data: [],
    };

    this.getTableHeader = this.getTableHeader.bind(this);
    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSorting = this.handleSorting.bind(this);
  }

  componentWillMount() {
    this.setState({
      data: mockData,
    });
  }

  render() {
    const { classes } = this.props;
    const { data } = this.state;

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transactionHistory" default="Transaction History" />
          </Typography>
          <Table className={classes.table}>
            {this.getTableHeader()}
            {this.getTableRows(data)}
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

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data = order === 'desc'
      ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  }

  getTableRows(data) {
    return (
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.txid}>
            <TableCell>
              {getShortLocalDateTimeString(item.time)}
            </TableCell>
            <TableCell>
              {item.from}
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
};

WalletHistory.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(WalletHistory)));
