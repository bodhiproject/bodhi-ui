import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Dialog, Grid, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import { urls } from '../../config/app';

const AppStoreBadge = '/images/app_store_badge.png';
const GooglePlayBadge = '/images/google_play_badge.png';
const ChromeWebStoreBadge = '/images/chrome_web_store_badge.png';
@withStyles(styles)
@inject('store')
@observer
class NoWalletPrompt extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  renderBadge = (badge, url) => {
    const { classes } = this.props;
    return (
      <Grid item xs={4} align="center">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={badge} className={classes.badgeImg} alt="badge" />
        </a>
      </Grid>
    );
  }

  renderTexts = () => {
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.text}>
          <FormattedMessage
            id="naka.notDetected"
            defaultMessage="Naka Wallet was not detected."
          />
        </div>
        <div className={classes.text}>
          <FormattedMessage
            id="naka.refresh"
            defaultMessage="Please make sure you are logged in and refresh the page."
          />
        </div>
      </Fragment>
    );
  }

  renderBadges = () => (
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
  )

  renderContent = () => {
    const { classes } = this.props;
    return (
      <Fragment>
        <img src="/images/naka_logo.png" alt="Naka Wallet Logo" className={classes.icon} />
        {this.renderTexts()}
        {this.renderBadges()}
      </Fragment>
    );
  }

  render() {
    const {
      classes,
      store: {
        ui: { noWalletDialogVisible, hideNoWalletDialog },
      },
      inline,
    } = this.props;

    if (inline) {
      return (
        <div className={classes.root}>
          {this.renderContent()}
        </div>
      );
    }

    return (
      <Dialog
        open={noWalletDialogVisible}
        onClose={hideNoWalletDialog}
        PaperProps={{ classes: { root: classes.dialog } }}
      >
        <div className={classes.root}>
          {this.renderContent()}
        </div>
      </Dialog>
    );
  }
}

export default NoWalletPrompt;
