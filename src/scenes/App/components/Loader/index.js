import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Grid, LinearProgress } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import AppConfig from '../../../../config/app';
import styles from './styles';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';


@withStyles(styles)
@connect((state) => ({
  syncPercent: state.App.get('syncPercent'),
  syncBlockNum: state.App.get('syncBlockNum'),
  syncBlockTime: state.App.get('syncBlockTime'),
  walletAddresses: state.App.get('walletAddresses'),
}))
export default class Loader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    syncPercent: PropTypes.number.isRequired,
    syncBlockNum: PropTypes.number.isRequired,
    syncBlockTime: PropTypes.number.isRequired,
    walletAddresses: PropTypes.array.isRequired,
  };

  render() {
    const { classes, syncPercent, syncBlockNum, syncBlockTime, walletAddresses } = this.props;
    const hideLoader = !AppConfig.debug.showAppLoad || (syncPercent >= 100 && !_.isEmpty(walletAddresses));

    return (
      <div
        className={classes.loaderBg}
        style={{
          opacity: hideLoader ? 0 : 1,
          display: hideLoader ? 'none' : 'block',
        }}
      >
        <div className={classes.loaderWrapper}>
          <div className={classes.loaderLogoWrapper}>
            <img className={classes.loaderGif} src="/images/loader.gif" alt="Loading..." />
          </div>
          <div className={classes.loaderPercentWrapper}>
            <Typography variant="display1" className={classes.loaderPercent}>{syncPercent || 0}</Typography>%
            <p>
              <FormattedMessage id="str.blockSync" defaultMessage="Blockchain syncing..." />
              &nbsp;
              <FormattedMessage id="str.wait" defaultMessage="Please wait." />
            </p>
          </div>
          <div className={classes.loaderProgressWrapper}>
            <LinearProgress className={classes.loaderProgress} variant="determinate" value={syncPercent} />
          </div>
          {Boolean(syncBlockNum && syncBlockTime) && (
            <Grid container className={classes.loaderInfoWrapper}>
              <Grid item className={classes.loaderInfoLabel} xs={6}>
                <FormattedMessage id="loader.blockNum" defaultMessage="Latest Block Number" />
              </Grid>
              <Grid item className={classes.loaderInfoData} xs={6}>
                {syncBlockNum}
              </Grid>
              <Grid item className={classes.loaderInfoLabel} xs={6}>
                <FormattedMessage id="loader.blockTime" defaultMessage="Latest Block Time" />
              </Grid>
              <Grid item className={classes.loaderInfoData} xs={6}>
                {getShortLocalDateTimeString(syncBlockTime)}
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}
