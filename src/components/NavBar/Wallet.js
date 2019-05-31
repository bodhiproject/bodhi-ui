import React from 'react';
import { IconButton, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import { Routes } from 'constants';

import styles from './styles';

const Wallet = ({ classes, history, store: { global, naka } }) => {
  // Local wallet means transactions are handled via a local wallet program, eg. Naka Wallet.
  if (global.localWallet) {
    return null;
  }

  return (
    <div className={classes.rightButtonContainer}>
      <IconButton
        className={classes.navButton}
        onClick={() => naka.loggedIn ? history.push(Routes.WALLET) : naka.openPopover()}
      >
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet')} />
      </IconButton>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer((Wallet))));
