/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, RemoveCircle as RemoveCircleIcon } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../helpers/utility';


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BottomBar extends Component {
  state = { // this state is used to re-render the dom here when going online/offline
    online: true,
  }

  componentDidMount() {
    // Subscribe to changes
    window.addEventListener('offline', () => this.setState({ online: false }));
    window.addEventListener('online', () => this.setState({ online: true }));
  }

  componentWillUnmount() {
    // Clean up listener
    window.removeEventListener('offline', () => this.setState({ online: false }));
    window.removeEventListener('online', () => this.setState({ online: true }));
  }

  render() {
    const { classes } = this.props;
    const { syncBlockTime, syncBlockNum, peerNodeNum } = this.props.store.global || { syncBlockTime: 1, syncBlockNum: 1, peerNodeNum: 1 };
    return (
      <Paper className={classes.bottomBarWrapper}>
        <NetworkConnection peerNum={peerNodeNum} />
        {syncBlockTime && <BlockInfo blockNum={syncBlockNum} blockTime={syncBlockTime} />}
      </Paper>
    );
  }
}

const BlockInfo = withStyles(styles)(({ classes, blockNum, blockTime }) => (
  <Grid item xs={12} md={6} className={classes.bottomBarBlockInfoWrapper}>
    <Typography variant="body1">
      <span className={classes.bottomBarBlockNum}><FormattedMessage id="bottomBar.blockNum" defaultMessage="Current Block Number" />:&nbsp;{blockNum}</span>
      <FormattedMessage id="bottomBar.blockTime" defaultMessage="Current Block Time" />:&nbsp;{blockTime ? getShortLocalDateTimeString(blockTime) : ''}
    </Typography>
  </Grid>
));

const NetworkConnection = withStyles(styles)(({ classes, peerNum }) => (
  <Grid item xs={12} md={6} className={classes.bottomBarNetworkWrapper}>
    <Typography variant="body1">
      {navigator.onLine ? (
        <CheckCircleIcon className={cx(classes.bottomBarNetworkIcon, 'online')} />
      ) : (
        <RemoveCircleIcon className={cx(classes.bottomBarNetworkIcon, 'offline')} />
      )}
      <span>
        {navigator.onLine ? (
          <Fragment>
            <FormattedMessage id="bottomBar.online" defaultMessage="Online" />
            :&nbsp;{peerNum}&nbsp;
            <FormattedMessage id="bottomBar.peers" defaultMessage="peers" />
          </Fragment>
        ) : (
          <FormattedMessage id="bottomBar.offline" defaultMessage="Offline" />
        )}
      </span>
    </Typography>
  </Grid>
));
