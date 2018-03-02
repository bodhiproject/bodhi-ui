import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import styles from './styles';

const mockData = [
  {
    token: 'QTUM',
    amount: 12345,
  },
  {
    token: 'BOT',
    amount: 67890,
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
      <Paper className={classes.myWalletPaper}>
        <Grid container spacing={0}>
          <Grid item className={classes.myWalletContainerGrid}>
            <Typography variant="title" className={classes.myWalletTitle}>
              <FormattedMessage id="myWallet.myBalance" />
            </Typography>
            <Grid container classname={classes.totalsContainerGrid}>
              {mockData.map((item) => (
                <Grid item key={item.token} className={classes.totalsItemGrid}>
                  <Typography variant="display1" className={classes.totalsItemAmount}>{item.amount}</Typography>
                  <Typography variant="body2">{item.token}</Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
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
