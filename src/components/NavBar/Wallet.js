import React from 'react';
import { IconButton, Badge, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import styles from './styles';

const Wallet = ({ classes, store: { global, naka } }) => {
  // Local wallet means transactions are handled via a local wallet program, eg. Qtum Wallet.
  if (global.localWallet) {
    return null;
  }

  return (
    <div className={classes.rightButtonContainer}>
      <IconButton className={classes.navButton} onClick={() => naka.openPopover()}>
        <Badge
          classes={{ badge: classes.walletStatusBadge }}
          color={naka.loggedIn ? 'secondary' : 'error'}
          badgeContent=""
        >
          <i className={cx('icon', 'iconfont', 'icon-ic_wallet')} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer((Wallet))));
