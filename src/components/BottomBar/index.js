/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Paper, Grid, Typography, withStyles } from '@material-ui/core';
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
    const { classes } = this.props;
    const { syncBlockTime, syncBlockNum, online } = this.props.store.global;
    return (
      <Paper className={classes.bottomBarWrapper}>
        <NetworkConnection online={online} />
        {syncBlockTime && <BlockInfo blockNum={syncBlockNum} blockTime={syncBlockTime} />}
      </Paper>
    );
  }
}

const BlockInfo = withStyles(styles)(({ classes, blockNum, blockTime }) => (
  <Grid container item xs={12} md={6} className={classes.bottomBarBlockInfoWrapper}>
    <Grid item xs={12} sm={6}>
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <span className={classes.bottomBarBlockNum}>
          <FormattedMessage
            id="bottomBar.blockNum"
            defaultMessage="Current Block Number"
          />
          {`: ${blockNum}`}
        </span>
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <span className={classes.bottomBarBlockTime}>
          <FormattedMessage
            id="bottomBar.blockTime"
            defaultMessage="Current Block Time"
          />
          {blockTime ? `: ${moment.unix(blockTime).format('LLL')}` : ''}
        </span>
      </Typography>
    </Grid>
  </Grid>
));

const NetworkConnection = withStyles(styles)(({ classes, online }) => (
  <Grid container item xs={12} md={6} className={classes.bottomBarNetworkWrapper}>
    <Grid item xs={12} sm={12} className={classes.bottomBarStatusContainer}>
      {online
        ? <CheckCircle className={cx(classes.bottomBarNetworkIcon, 'online')} />
        : <RemoveCircle className={cx(classes.bottomBarNetworkIcon, 'offline')} />
      }
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <FormattedMessage
          id="bottomBar.networkStatus"
          defaultMessage="Network Status"
        />
      </Typography>
    </Grid>
  </Grid>
));
