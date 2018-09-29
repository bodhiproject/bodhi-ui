import React from 'react';
import { withStyles, Typography, Button, Popover, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';

const messages = defineMessages({
  'qrypto.loggedIn': {
    id: 'qrypto.loggedIn',
    defaultMessage: 'You are logged in to Qrypto.',
  },
  'qrypto.loginToView': {
    id: 'qrypto.loginToView',
    defaultMessage: 'Please login to Qrypto to view this page.',
  },
  'qrypto.notInstalled': {
    id: 'qrypto.notInstalled',
    defaultMessage: 'You have not installed Qrypto yet. Qrypto is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience.',
  },
  'qrypto.notLoggedIn': {
    id: 'qrypto.notLoggedIn',
    defaultMessage: 'You are not logged into Qrypto.',
  },
  'qrypto.loggedIntoWrongNetwork': {
    id: 'qrypto.loggedIntoWrongNetwork',
    defaultMessage: 'Logged into wrong network. Switch your Qrypto network.',
  },
});

const Logo = withStyles(styles)(({ classes }) => (
  <img src="/images/qrypto-logo.png" alt="Qrypto Logo" className={classes.logo} />
));

const InstallNowButton = inject('store')(({ store: { qrypto } }) => (
  <Button
    variant="raised"
    size="small"
    color="primary"
    onClick={qrypto.onInstallClick}
  >
    <FormattedMessage id="qrypto.installNow" defaultMessage="Install Now" />
  </Button>
));

export const InstallQryptoInline = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, store: { qrypto } }) => (
  <div className={classes.inlineRoot}>
    <Logo />
    <Grid container>
      <Grid item xs></Grid>
      <Grid item xs={12} sm={6}>
        <Typography className={cx(classes.message, 'center')}>
          {intl.formatMessage(qrypto.isInstalled ? messages['qrypto.loginToView'] : messages['qrypto.notInstalled'])}
        </Typography>
      </Grid>
      <Grid item xs></Grid>
    </Grid>
    {!qrypto.isInstalled && <InstallNowButton />}
  </div>
)))));

export const InstallQryptoPopover = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, store: { qrypto } }) => {
  if (!qrypto.popoverMessageId) return null;
  const message = messages[qrypto.popoverMessageId];

  return (
    <Popover
      open={qrypto.popoverOpen}
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
            {qrypto.isInstalled ? (
              <Button
                variant="raised"
                size="small"
                color="primary"
                onClick={() => qrypto.popoverOpen = false}
              >
                <FormattedMessage id="str.ok" defaultMessage="Ok" />
              </Button>
            ) : (
              <div>
                <Button
                  size="small"
                  color="primary"
                  className={classes.remindButton}
                  onClick={() => qrypto.popoverOpen = false}
                >
                  <FormattedMessage id="qrypto.remindMeLater" defaultMessage="Remind Me Later" />
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
