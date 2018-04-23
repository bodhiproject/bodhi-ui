import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';

import AppConfig from '../../../../config/app';
import styles from './styles';
import { getLocalDateTimeString } from '../../../../helpers/utility';

@withStyles(styles, { withTheme: true })
@connect((state) => ({
}), (dispatch) => ({
}))

export default class TermsAndConditions extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    const show = localStorage.getItem('termsAndConditionsApproved');

    return (
      <div
        className={classes.loaderBg}
        style={
          {
            opacity: show ? 1 : 0,
            display: show ? 'block' : 'none',
          }
        }
      >
        <div className={classes.loaderWrapper}>
          <div className={classes.loaderLogoWrapper}>
            <img className={classes.loaderGif} src="/images/loader.gif" alt="Loading..." />
          </div>
          <div className={classes.loaderPercentWrapper}>
            <Typography variant="display1" className={classes.loaderPercent}>{syncPercent || 0}</Typography>%
            <p>
              <FormattedMessage id="str.blockSync" defaultMessage="Blockchain syncing." />
              <FormattedMessage id="str.wait" defaultMessage="Please wait." />
            </p>
          </div>
          <div className={classes.loaderProgressWrapper}>
            <LinearProgress className={classes.loaderProgress} variant="determinate" value={syncPercent} />
          </div>
          { syncBlockNum && syncBlockTime ?
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
                {getLocalDateTimeString(syncBlockTime)}
              </Grid>
            </Grid> : null
          }
        </div>
      </div>
    );
  }
}
