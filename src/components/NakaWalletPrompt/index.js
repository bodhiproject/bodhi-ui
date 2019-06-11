import React from 'react';
import { withStyles, Typography, Button, Popover, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';

const messages = defineMessages({
  'naka.loggedIn': {
    id: 'naka.loggedIn',
    defaultMessage: 'You are logged in to Naka Wallet.',
  },
  'naka.loginToView': {
    id: 'naka.loginToView',
    defaultMessage: 'Please login to Naka Wallet to view this page.',
  },
  'naka.notInstalled': {
    id: 'naka.notInstalled',
    defaultMessage: 'You have not installed Naka Wallet yet. Naka Wallet is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience.',
  },
  'naka.notLoggedIn': {
    id: 'naka.notLoggedIn',
    defaultMessage: 'You are not logged into Naka Wallet.',
  },
  'naka.loggedIntoWrongNetwork': {
    id: 'naka.loggedIntoWrongNetwork',
    defaultMessage: 'Logged into wrong network. Switch your Naka Wallet network.',
  },
});

const Logo = withStyles(styles)(({ classes }) => (
  <img src="/images/naka_logo.png" alt="Naka Wallet Logo" className={classes.logo} />
));

const InstallNowButton = inject('store')(({ store: { naka } }) => (
  <Button
    variant="contained"
    size="small"
    color="primary"
    onClick={naka.onInstallClick}
  >
    <FormattedMessage id="naka.installNow" defaultMessage="Install Now" />
  </Button>
));

export const InstallNakaWalletInline = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, store: { naka } }) => (
  <div className={classes.inlineRoot}>
    <Logo />
    <Grid container>
      <Grid item xs></Grid>
      <Grid item xs={12} sm={6}>
        <Typography className={cx(classes.message, 'center')}>
          {intl.formatMessage(naka.isInstalled ? messages['naka.loginToView'] : messages['naka.notInstalled'])}
        </Typography>
      </Grid>
      <Grid item xs></Grid>
    </Grid>
    {!naka.isInstalled && <InstallNowButton />}
  </div>
)))));

export const InstallNakaWalletPopover = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, store: { naka } }) => {
  if (!naka.popoverMessageId) return null;
  const message = messages[naka.popoverMessageId];

  return (
    <Popover
      open={naka.popoverOpen}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      transformOrigin={{ horizontal: 'center', vertical: 'center' }}
    >
      <div className={classes.popoverRoot}>
        <Grid container>
          <Grid item xs={12} sm={2}><Logo /></Grid>
          <Grid item xs={12} sm={10}>
            <Typography className={cx(classes.message, 'left', 'marginLeft')}>
              {intl.formatMessage(message)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs className={classes.buttonContainer}>
            {naka.isInstalled ? (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => naka.popoverOpen = false}
              >
                <FormattedMessage id="str.ok" defaultMessage="Ok" />
              </Button>
            ) : (
              <div>
                <Button
                  size="small"
                  color="primary"
                  className={classes.remindButton}
                  onClick={() => naka.popoverOpen = false}
                >
                  <FormattedMessage id="naka.remindMeLater" defaultMessage="Remind Me Later" />
                </Button>
                <InstallNowButton />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </Popover>
  );
}))));
