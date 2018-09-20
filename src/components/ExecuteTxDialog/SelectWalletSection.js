import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Select, MenuItem, Typography, Grid } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import styles from './styles';
import { WalletProvider } from '../../constants';

const SelectWalletSection = ({ classes, store: { tx } }) => (
  <Grid container className={classes.selectWalletContainer}>
    <Grid item xs={12} sm={5}>
      <Typography className={classes.selectWalletText}>
        <FormattedMessage id="txConfirm.selectWalletProvider" defaultMessage="Select your wallet provider:" />
      </Typography>
    </Grid>
    <Grid item xs={12} sm={7}>
      <Select disableUnderline value={tx.provider} onChange={e => tx.provider = e.target.value}>
        <MenuItem value={WalletProvider.QRYPTO}><FormattedMessage id="str.qrypto" defaultMessage="Qrypto" /></MenuItem>
      </Select>
    </Grid>
  </Grid>
);

export default withStyles(styles)(inject('store')(observer(SelectWalletSection)));
