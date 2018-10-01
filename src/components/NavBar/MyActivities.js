import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Routes } from 'constants';
import cx from 'classnames';
import { includes } from 'lodash';

import styles from './styles';
import NavLink from './components/NavLink';

const MyActivities = ({ classes, store: { global, ui } }) => {
  const actionableCount = global.userData.totalCount;
  const selected = includes([Routes.SET, Routes.FINALIZE, Routes.WITHDRAW, Routes.ACTIVITY_HISTORY], ui.location) ? 'selected' : '';

  return (
    <NavLink to={Routes.ACTIVITY_HISTORY}>
      <div className={cx(classes.rightButtonContainer, classes.myActivitiesWrapper)}>
        <div className={classes.myActivitiesButton}>
          <Typography className={cx(classes.navButton, selected)}>
            {actionableCount > 0 && <div className={classes.myActivitiesActionableCount}>{actionableCount}</div>}
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Typography>
        </div>
      </div>
    </NavLink>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer(MyActivities)));
