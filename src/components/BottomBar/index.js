/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Box, Paper, Typography, withStyles } from '@material-ui/core';
import { CheckCircle, RemoveCircle } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BottomBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      classes,
      store: {
        global: { syncBlockTime, online },
        naka: { loggedIn },
        wallet: { lastAddressWithdrawLimit },
      },
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="flex-start">
          <NetworkConnection online={online} loggedIn={loggedIn} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Info blockTime={syncBlockTime} lastAddressWithdrawLimit={lastAddressWithdrawLimit} />
        </Box>
      </Paper>
    );
  }
}

const NetworkConnection = withStyles(styles)(({ classes, online, loggedIn }) => (
  <div>
    <div className={classes.statusContainer}>
      {online
        ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
        : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
      }
      <Typography variant="body2" className={cx(classes.bottomBarTxt, 'network')}>
        <FormattedMessage id="bottomBar.network" defaultMessage="Network" />
      </Typography>
    </div>
    <div className={classes.statusContainer}>
      {loggedIn
        ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
        : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
      }
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <FormattedMessage id="bottomBar.wallet" defaultMessage="Wallet" />
      </Typography>
    </div>
  </div>
));

const Info = withStyles(styles)(({ classes, lastAddressWithdrawLimit, blockTime }) => (
  <div>
    <div className={classes.blockItemContainer}>
      <Typography variant="body2" className={cx(classes.bottomBarTxt, 'blockNum')}>
        <span>
          <FormattedMessage
            id="bottomBar.blockTime"
            defaultMessage="Current Block Time"
          />
          {`: ${getTime(blockTime)}`}
        </span>
      </Typography>
    </div>
    <div className={classes.blockItemContainer}>
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <span>
          <FormattedMessage
            id="bottomBar.nbotBalance"
            defaultMessage="NBOT Balance"
          />
          {`: ${lastAddressWithdrawLimit.NBOT ? lastAddressWithdrawLimit.NBOT.toFixed(2) : ''}`}
        </span>
      </Typography>
    </div>
  </div>
));

const getTime = (blockTime) => {
  if (blockTime) {
    return moment.unix(blockTime).format('LL');
  }
  return '';
};
