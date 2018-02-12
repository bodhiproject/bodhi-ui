import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginBottom: 4,
  },
  panelSummary: {
    background: '#F9F9F9',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 4,
  },
});

const buttonColStyle = {
  width: 50,
};

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
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} margin={4}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Coin</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((item) => (
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
}

TransactionHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

TransactionHistory.defaultProps = {
};

export default withStyles(styles)(TransactionHistory);
