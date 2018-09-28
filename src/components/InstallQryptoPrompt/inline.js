import React from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import styles from './styles';

const InstallQryptoInline = ({ classes }) => (
  <div className={classes.root}>
    <img src="/images/qrypto-logo.png" alt="Qrypto Logo" className={classes.logo} />
    <Typography variant="headline" className={classes.message}>
      <FormattedMessage
        id="qrypto.notInstalled"
        defaultMessage="You have not installed Qrypto yet. Qrypto is a Chrome extension wallet that allows you to sign transaction requests from web dapps. It is strongly recommended that you install it to gain the full experience."
      />
    </Typography>
    <div className={classes.buttonContainer}>
      <Button variant="raised" size="large" color="primary">
        <FormattedMessage id="qrypto.installNow" defaultMessage="Install Now" />
      </Button>
    </div>
  </div>
);

export default withStyles(styles)(InstallQryptoInline);
