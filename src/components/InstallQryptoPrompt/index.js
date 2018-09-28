import React from 'react';
import { withStyles, Typography, Button, Popover, Grid } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import styles from './styles';


const Logo = withStyles(styles)(({ classes }) => (
  <img src="/images/qrypto-logo.png" alt="Qrypto Logo" className={classes.logo} />
));

const Message = withStyles(styles)(({ classes }) => (
  <Typography variant="headline" className={classes.message}>
    <FormattedMessage
      id="qrypto.notInstalled"
      defaultMessage="You have not installed Qrypto yet. Qrypto is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience."
    />
  </Typography>
));

export const InstallQryptoInline = withStyles(styles)(({ classes }) => (
  <div className={classes.inlineRoot}>
    <Logo />
    <Message />
    <div className={classes.buttonContainer}>
      <Button variant="raised" size="large" color="primary">
        <FormattedMessage id="qrypto.installNow" defaultMessage="Install Now" />
      </Button>
    </div>
  </div>
));

export const InstallQryptoPopover = withStyles(styles)(({ classes }) => (
  <Popover>
    <div className={classes.popoverRoot}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <Logo />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Message />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs>
          <Button size="large" color="primary">
            <FormattedMessage id="qrypto.remindMeLater" defaultMessage="Remind Me Later" />
          </Button>
          <Button variant="raised" size="large" color="primary">
            <FormattedMessage id="qrypto.installNow" defaultMessage="Install Now" />
          </Button>
        </Grid>
      </Grid>
    </div>
  </Popover>
));
