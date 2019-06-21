/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Box, Paper, Typography, withStyles } from '@material-ui/core';
import { CheckCircle, RemoveCircle } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Token } from 'constants';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles';
import { shortenText } from '../../helpers/utility';


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
        naka: { loggedIn, account },
        wallet: { lastAddressWithdrawLimit },
      },
    } = this.props;

    let slicedAddress = shortenText(account, 6);
    slicedAddress = slicedAddress.length > 0 ? `: (${slicedAddress})` : '';

    return (
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <NetworkConnection online={online} loggedIn={loggedIn} />
          <BlockTime blockTime={syncBlockTime} />
        </Box>
        <Box display="flex" justifyContent="space-between" width="100%">
          <WalletStatus loggedIn={loggedIn} slicedAddress={slicedAddress} />
          <Balance lastAddressWithdrawLimit={lastAddressWithdrawLimit} />
        </Box>
      </Paper>
    );
  }
}

const NetworkConnection = withStyles(styles)(({ classes, online }) => (
  <div className={classes.statusContainer}>
    {online
      ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
      : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
    }
    <Typography variant="body2" className={cx(classes.bottomBarTxt, 'network')}>
      <FormattedMessage id="bottomBar.network" defaultMessage="Network" />
    </Typography>
  </div>
));

const WalletStatus = withStyles(styles)(({ classes, loggedIn, slicedAddress }) => (
  <div className={classes.statusContainer}>
    {loggedIn
      ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
      : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
    }
    <Typography variant="body2" className={classes.bottomBarTxt}>
      <FormattedMessage id="bottomBar.wallet" defaultMessage="Wallet" />
      {slicedAddress}
    </Typography>
  </div>
));

const BlockTime = withStyles(styles)(({ classes, blockTime }) => (
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
));

const Balance = withStyles(styles)(({ classes, lastAddressWithdrawLimit }) => (
  <div className={classes.blockItemContainer}>
    <Typography variant="body2" className={classes.bottomBarTxt}>
      <span>
        <FormattedMessage
          id="bottomBar.nbotBalance"
          defaultMessage="Balance"
        />
        {`: ${lastAddressWithdrawLimit.NBOT ? `${lastAddressWithdrawLimit.NBOT.toFixed(2, true)} ${Token.NBOT}` : '0.00'}`}
      </span>
    </Typography>
  </div>
));

const getTime = (blockTime) => {
  if (blockTime) {
    return moment.unix(blockTime).format('LL');
  }
  return '';
};
