import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import cx from 'classnames';

import styles from './styles';

export const Favorite = withStyles(styles)(inject('store')(observer(({ classes, store: { ui } }) => (
  <Button className={cx(classes.navButton)} onClick={() => ui.favoriteDrawerOpen = !ui.favoriteDrawerOpen}>
    <FavoriteIcon />
  </Button>
))));

