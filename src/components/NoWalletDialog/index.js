import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Dialog, Typography, Grid, withStyles } from '@material-ui/core';
import { SentimentVeryDissatisfied } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import { urls } from '../../config/app';
import AppStoreBadge from '../../../public/images/app_store_badge.png';
import GooglePlayBadge from '../../../public/images/google_play_badge.png';
import ChromeWebStoreBadge from '../../../public/images/chrome_web_store_badge.png';

@withStyles(styles)
@inject('store')
@observer
class NoWalletDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  renderBadge = (badge, url) => {
    const { classes } = this.props;
    return (
      <Grid item xs={12} sm={4} align="center">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={badge} className={classes.badgeImg} alt="badge" />
        </a>
      </Grid>
    );
  }

  render() {
    const {
      classes,
      store: {
        ui: { noWalletDialogVisible, hideNoWalletDialog },
      },
    } = this.props;

    return (
      <Dialog
        open={noWalletDialogVisible}
        onClose={hideNoWalletDialog}
      >
        <div className={classes.root}>
          <SentimentVeryDissatisfied className={classes.icon} />
          <Typography variant="h6">
            <FormattedMessage
              id="naka.notDetected"
              defaultMessage="Naka Wallet was not detected."
            />
          </Typography>
          <Typography variant="h6" className={classes.loggedInText}>
            <FormattedMessage
              id="naka.notInstalled"
              defaultMessage="You have not installed Naka Wallet yet. Naka Wallet is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience."
            />
          </Typography>

          <Grid
            container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
            alignContent="center"
          >
            {this.renderBadge(AppStoreBadge, urls.NAKA_WALLET_APP_STORE)}
            {this.renderBadge(GooglePlayBadge, urls.NAKA_WALLET_PLAY_STORE)}
            {this.renderBadge(ChromeWebStoreBadge, urls.NAKA_WALLET_CHROME)}
          </Grid>
        </div>
      </Dialog>
    );
  }
}

export default NoWalletDialog;
