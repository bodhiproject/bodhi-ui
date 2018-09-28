import React from 'react';
import { IconButton, withStyles } from '@material-ui/core';
import { inject } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';


const Wallet = ({ classes, store: { global, installQryptoPrompt } }) => {
  // Local wallet means transactions are handled via a local wallet program, eg. Qtum Wallet.
  if (global.localWallet) {
    return null;
  }

  return (
    <div className={classes.rightButtonContainer}>
      <IconButton className={classes.walletButton} onClick={() => installQryptoPrompt.popoverOpen = true}>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet')} />
      </IconButton>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')((Wallet)));