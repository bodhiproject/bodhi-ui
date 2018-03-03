import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';

const mockData = [
  {
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 1,
    fee: 0.1,
    status: 'Pending',
  },
  {
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3',
    token: 'QTUM',
    amount: 2,
    fee: 0.2,
    status: 'Pending',
  },
  {
    time: moment(),
    from: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    to: 'qbyAYsQQf7U4seauDv9cYjwfiNrR9fJz3R',
    token: 'QTUM',
    amount: 3,
    fee: 0.3,
    status: 'Pending',
  },
  {
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
    this.getTableRows = this.getTableRows.bind(this);
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
      <Paper className={classes.rootPaper}>
        <Grid container spacing={0} className={classes.containerGrid}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transactionHistory" />
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
    const { classes } = this.props;
    const { order, orderBy } = this.state;

    const headerCols = [
      {
        id: 'time',
        name: 'walletHistory.time',
        numeric: false,
      },
      {
        id: 'from',
        name: 'walletHistory.from',
        numeric: false,
      },
      {
        id: 'to',
        name: 'walletHistory.to',
        numeric: false,
      },
      {
        id: 'token',
        name: 'walletHistory.token',
        numeric: false,
      },
      {
        id: 'amount',
        name: 'walletHistory.amount',
        numeric: true,
      },
      {
        id: 'fee',
        name: 'walletHistory.transactionFee',
        numeric: true,
      },
      {
        id: 'status',
        name: 'walletHistory.status',
        numeric: false,
      },
    ];

    return (
      <TableHead
        order={order}
        orderBy={orderBy}
      >
        <TableRow className={classes.tableHeader}>
          {headerCols.map((column) => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding="none"
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  <Typography variant="body1" className={classes.tableHeaderItemText}>
                    <FormattedMessage id={column.name} />
                  </Typography>
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
    const { classes } = this.props;

    return (
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.address} className={classes.tableRow}>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {getShortLocalDateTimeString(item.time)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.from}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.to}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.token}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.amount}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.fee}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" className={classes.tableRowCell}>
                {item.status}
              </Typography>
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
