import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';

import styles from './styles';

const NotLoggedInMessage = ({ classes }) => (
  <div className={classes.notLoggedInContainer}>
    <Warning className={classes.notLoggedInIcon} />
    <Typography variant="headline" className={classes.notLoggedInText}>
      <FormattedMessage id="notLoggedIn.qryptoLogin" defaultMessage="Please login to Qrypto to view this page." />
    </Typography>
  </div>
);

export default withStyles(styles)(NotLoggedInMessage);
