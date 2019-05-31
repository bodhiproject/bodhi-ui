import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import cx from 'classnames';
import { Routes, EventStatus } from 'constants';

import styles from './styles';
import NavLink from './components/NavLink';

export const Favorite = withStyles(styles)(inject('store')(observer(({ classes, store: { favorite, ui } }) => (
  <NavLink to={Routes.FAVORITE}>
    <Button
      data-index={EventStatus.VOTE}
      className={cx(
        classes.navButton,
        ui.location === Routes.ARBITRATION ? 'selected' : '',
      )}
    >
      <FavoriteIcon />
    </Button>
  </NavLink>
))));

