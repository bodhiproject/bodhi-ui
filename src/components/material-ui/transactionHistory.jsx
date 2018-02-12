import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableHead, TableBody, TableRow, TableCell, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';

import { SortBy } from '../../constants';

const ID_STATUS = 'status';
const ID_COIN = 'coin';
const ID_AMOUNT = 'amount';
const ID_DATE = 'date';
const ID_USER = 'user';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  headerCell: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const headerRow = [{
  id: ID_STATUS,
  label: 'Status',
  numeric: false,
  disablePadding: false,
}, {
  id: ID_COIN,
  label: 'Coin',
  numeric: false,
  disablePadding: false,
}, {
  id: ID_AMOUNT,
  label: 'Amount',
  numeric: false,
  disablePadding: false,
}, {
  id: ID_DATE,
  label: 'Date',
  numeric: false,
  disablePadding: false,
}, {
  id: ID_USER,
  label: 'User',
  numeric: false,
  disablePadding: false,
}];

class TransactionHistory extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: [{
        id: '1',
        status: 'Pending',
        coin: 'QTUM',
        amount: 1111,
        date: 'Sep 1, 2018 12:00:00',
        user: 'user1',
      }, {
        id: '2',
        status: 'Completed',
        coin: 'QTUM',
        amount: 2222,
        date: 'Sep 1, 2018 12:00:00',
        user: 'user2',
      }, {
        id: '3',
        status: 'Pending',
        coin: 'BOT',
        amount: 3333,
        date: 'Sep 1, 2018 12:00:00',
        user: 'user3',
      }, {
        id: '4',
        status: 'Completed',
        coin: 'BOT',
        amount: 4444,
        date: 'Sep 1, 2018 12:00:00',
        user: 'user4',
      }],
      order: SortBy.Descending.toLowerCase(),
      orderBy: ID_STATUS,
    };

    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy } = this.state;

    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            {headerRow.map((item) => (
              <TableCell
                className={classes.headerCell}
                key={item.id}
                numeric={item.numeric}
                padding={item.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === item.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={item.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    className={classes.headerLabel}
                    active={orderBy === item.id}
                    direction={order}
                    onClick={this.createSortHandler(item.id)}
                  >
                    {item.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ))}
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.coin}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  createSortHandler = (property) => (event) => {
    this.handleSortClick(event, property);
  };

  handleSortClick(event, property) {
    const orderBy = property;
    let order = SortBy.Descending.toLowerCase();

    if (this.state.orderBy === property && this.state.order === SortBy.Descending.toLowerCase()) {
      order = SortBy.Ascending.toLowerCase();
    }

    const data = order === SortBy.Descending.toLowerCase()
      ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({
      data,
      order,
      orderBy,
    });
  }
}

TransactionHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

TransactionHistory.defaultProps = {
};

export default withStyles(styles)(TransactionHistory);
