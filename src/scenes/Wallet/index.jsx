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

import styles from './styles';

const mockTotals = [
  {
    token: 'QTUM',
    amount: 12345,
  },
  {
    token: 'BOT',
    amount: 67890,
  },
];
const mockRows = [
  {
    address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    qtum: 1234567890,
    bot: 1234567890,
  },
  {
    address: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    qtum: 1234567890,
    bot: 1234567890,
  },
  {
    address: 'qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3',
    qtum: 1234567890,
    bot: 1234567890,
  },
  {
    address: 'qbyAYsQQf7U4seauDv9cYjwfiNrR9fJz3R',
    qtum: 1234567890,
    bot: 1234567890,
  },
];

class MyWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.rootPaper}>
        <Grid container spacing={0} className={classes.containerGrid}>
          <Typography variant="title" className={classes.myBalanceTitle}>
            <FormattedMessage id="myWallet.myBalance" />
          </Typography>
          <Grid container classname={classes.totalsContainerGrid}>
            {mockTotals.map((item) => (
              <Grid item key={item.token} className={classes.totalsItemGrid}>
                <Typography variant="display1" className={classes.totalsItemAmount}>{item.amount}</Typography>
                <Typography variant="body2">{item.token}</Typography>
              </Grid>
            ))}
          </Grid>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell>
                  <Typography variant="body1" className={classes.tableHeaderItemText}>
                    <FormattedMessage id="myWallet.address" />
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell numeric>
                  <Typography variant="body1" className={classes.tableHeaderItemText}>
                    <FormattedMessage id="myWallet.qtum" />
                  </Typography>
                </TableCell>
                <TableCell numeric>
                  <Typography variant="body1" className={classes.tableHeaderItemText}>
                    <FormattedMessage id="myWallet.bot" />
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" className={classes.tableHeaderItemText}>
                    <FormattedMessage id="myWallet.actions" />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRows.map((item) => (
                <TableRow key={item.address}>
                  <TableCell className={classes.tableRowCell}>
                    <Typography variant="body1" className={classes.tableRowAddressText}>{item.address}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button size="small" className={classes.tableRowCopyButton}>
                      <ContentCopy className={classes.tableRowCopyButtonIcon} />
                      <FormattedMessage id="myWallet.copy" />
                    </Button>
                  </TableCell>
                  <TableCell numeric>{item.qtum}</TableCell>
                  <TableCell numeric>{item.bot}</TableCell>
                  <TableCell>
                    <Button variant="raised" size="small" className={classes.tableRowActionButton}>
                      <FormattedMessage id="myWallet.deposit" />
                    </Button>
                    <Button variant="raised" size="small" className={classes.tableRowActionButton}>
                      <FormattedMessage id="myWallet.withdraw" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Paper>
    );
  }
}

MyWallet.propTypes = {
  classes: PropTypes.object.isRequired,
};

MyWallet.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(MyWallet)));
