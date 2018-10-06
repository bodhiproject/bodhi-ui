/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { CheckCircle as CheckCircleIcon, RemoveCircle as RemoveCircleIcon } from '@material-ui/icons';
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
    const { syncBlockTime, syncBlockNum, peerNodeCount, online } = this.props.store.global;
    return (
      <Paper className={classes.bottomBarWrapper}>
        <NetworkConnection peerNodeCount={peerNodeCount} online={online} />
        {syncBlockTime && <BlockInfo blockNum={syncBlockNum} blockTime={syncBlockTime} />}
      </Paper>
    );
  }
}

const BlockInfo = withStyles(styles)(({ classes, blockNum, blockTime }) => (
  <Grid container item xs={12} md={7} className={classes.bottomBarBlockInfoWrapper}>
    <Grid item xs={12} sm={6}>
      <Typography variant="body1" className={classes.bottomBarTxt}>
        <span className={classes.bottomBarBlockNum}><FormattedMessage id="bottomBar.blockNum" defaultMessage="Current Block Number" />{`: ${blockNum}`}</span>
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography variant="body1" className={classes.bottomBarTxt}>
        <span className={classes.bottomBarBlockTime}><FormattedMessage id="bottomBar.blockTime" defaultMessage="Current Block Time" />: {blockTime ? moment.unix(blockTime).format('LLL') : ''}</span>
      </Typography>
    </Grid>
  </Grid>
));

const NetworkConnection = withStyles(styles)(({ classes, peerNodeCount, online }) => (
  <Grid container item xs={12} md={6} className={classes.bottomBarNetworkWrapper}>
    {online ? (
      <Fragment>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" className={classes.bottomBarTxt}>
            <CheckCircleIcon className={cx(classes.bottomBarNetworkIcon, 'online')} />
            <FormattedMessage id="bottomBar.online" defaultMessage="Online" />:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" className={classes.bottomBarTxt}>
            {`${peerNodeCount} `}
            <FormattedMessage id="bottomBar.peers" defaultMessage="peers" />
          </Typography>
        </Grid>
      </Fragment>
    ) : (
      <Fragment>
        <Grid item xs={12} sm={2}>
          <Typography variant="body1" className={classes.bottomBarTxt}>
            <RemoveCircleIcon className={cx(classes.bottomBarNetworkIcon, 'offline')} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" className={classes.bottomBarTxt}>
            <FormattedMessage id="bottomBar.offline" defaultMessage="Offline" />
          </Typography>
        </Grid>
      </Fragment>
    )}
  </Grid>
));
