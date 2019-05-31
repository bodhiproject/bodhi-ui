import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import cx from 'classnames';
import { Routes, EventStatus } from 'constants';

import styles from './styles';
import NavLink from './components/NavLink';

export const Favorite = withStyles(styles)(inject('store')(observer(({ classes, store: { ui } }) => (
  <NavLink to={Routes.FAVORITE}>
    <Button
      data-index={EventStatus.FAVORITE}
      className={cx(
        classes.navButton,
        ui.location === Routes.FAVORITE ? 'selected' : '',
      )}
    >
      <FavoriteIcon />
    </Button>
  </NavLink>
))));

