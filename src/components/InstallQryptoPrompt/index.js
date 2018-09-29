import React from 'react';
import { withStyles, Typography, Button, Popover, Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

import styles from './styles';


const Logo = withStyles(styles)(({ classes }) => (
  <img src="/images/qrypto-logo.png" alt="Qrypto Logo" className={classes.logo} />
));

const Message = withStyles(styles)(({ classes, textAlign }) => (
  <Typography className={cx(classes.message, textAlign)}>
    <FormattedMessage
      id="qrypto.notInstalled"
      defaultMessage="You have not installed Qrypto yet. Qrypto is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience."
    />
  </Typography>
));

const InstallNowButton = inject('store')(({ store: { installQryptoPrompt } }) => (
  <Button
    variant="raised"
    size="small"
    color="primary"
    onClick={installQryptoPrompt.onInstallClick}
  >
    <FormattedMessage id="qrypto.installNow" defaultMessage="Install Now" />
  </Button>
));

export const InstallQryptoInline = withStyles(styles)(({ classes }) => (
  <div className={classes.inlineRoot}>
    <Logo />
    <Grid container>
      <Grid item xs></Grid>
      <Grid item xs={12} sm={6}><Message textAlign="center" /></Grid>
      <Grid item xs></Grid>
    </Grid>
    <InstallNowButton />
  </div>
));

export const InstallQryptoPopover = withStyles(styles)(inject('store')(observer(({ classes, store: { installQryptoPrompt } }) => (
  <Popover
    open={installQryptoPrompt.popoverOpen}
    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    transformOrigin={{ horizontal: 'center', vertical: 'center' }}
  >
    <div className={classes.popoverRoot}>
      <Grid container>
        <Grid item xs={12} sm={2}><Logo /></Grid>
        <Grid item xs={12} sm={10}><Message textAlign="left" /></Grid>
      </Grid>
      <Grid container>
        <Grid item xs className={classes.buttonContainer}>
          <Button
            size="small"
            color="primary"
            className={classes.remindButton}
            onClick={() => installQryptoPrompt.popoverOpen = false}
          >
            <FormattedMessage id="qrypto.remindMeLater" defaultMessage="Remind Me Later" />
          </Button>
          <InstallNowButton />
        </Grid>
      </Grid>
    </div>
  </Popover>
))));
