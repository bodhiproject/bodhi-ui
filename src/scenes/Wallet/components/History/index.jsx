import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import ContentCopy from 'material-ui-icons/ContentCopy';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import moment from 'moment';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';

const mockRows = [
  {
    time: moment(),
    from: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 12345,
    fee: 1,
    status: 'Pending',
  },
  {
    time: moment(),
    from: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 12345,
    fee: 1,
    status: 'Pending',
  },
  {
    time: moment(),
    from: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 12345,
    fee: 1,
    status: 'Pending',
  },
  {
    time: moment(),
    from: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    to: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    token: 'QTUM',
    amount: 12345,
    fee: 1,
    status: 'Pending',
  },
];

class WalletHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.getHeaderColumns = this.getHeaderColumns.bind(this);
    this.getRowColumns = this.getRowColumns.bind(this);
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.rootPaper}>
        <Grid container spacing={0} className={classes.containerGrid}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transactionHistory" />
          </Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                {this.getHeaderColumns()}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.getRowColumns(mockRows)}
            </TableBody>
          </Table>
        </Grid>
      </Paper>
    );
  }

  getHeaderColumns() {
    const { classes } = this.props;

    const headerCols = [
      {
        id: 'walletHistory.time',
      },
      {
        id: 'walletHistory.from',
      },
      {
        id: 'walletHistory.to',
      },
      {
        id: 'walletHistory.token',
      },
      {
        id: 'walletHistory.amount',
      },
      {
        id: 'walletHistory.transactionFee',
      },
      {
        id: 'walletHistory.status',
      },
    ];

    return headerCols.map((item) => (
      <TableCell>
        <Typography variant="body1" className={classes.tableHeaderItemText}>
          <FormattedMessage id={item.id} />
        </Typography>
      </TableCell>
    ));
  }

  getRowColumns(data) {
    const { classes } = this.props;

    return data.map((item) => (
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
    ));
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
