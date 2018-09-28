import React from 'react';
import { withStyles, Badge, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Routes } from 'constants';
import cx from 'classnames';
import { includes } from 'lodash';

import styles from './styles';
import NavLink from './components/NavLink';


const MyActivities = ({ classes, store: { global, ui } }) => {
  const selected = includes([Routes.SET, Routes.FINALIZE, Routes.WITHDRAW, Routes.ACTIVITY_HISTORY], ui.location) ? 'selected' : '';

  if (global.userData.totalCount > 0) {
    return (
      <NavLink to={Routes.ACTIVITY_HISTORY}>
        <div className={cx(classes.rightButtonContainer, classes.myActivitiesWrapper)}>
          <div className={classes.myActivitiesButton}>
            <Badge badgeContent={global.userData.totalCount} color="secondary" classes={{ badge: classes.myActivitiesBadgeBadge }}>
              <Typography className={cx(classes.navText, selected)}>
                <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
              </Typography>
            </Badge>
          </div>
        </div>
      </NavLink>
    );
  }
  return (
    <NavLink to={Routes.ACTIVITY_HISTORY}>
      <div className={cx(classes.rightButtonContainer, classes.myActivitiesWrapper)}>
        <div className={classes.myActivitiesButton}>
          <Typography className={cx(classes.navText, selected)}>
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Typography>
        </div>
      </div>
    </NavLink>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer(MyActivities)));
