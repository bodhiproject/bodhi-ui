import React from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Routes } from 'constants';
import cx from 'classnames';
import { includes } from 'lodash';

import styles from './styles';
import NavLink from './components/NavLink';
import ActionableBadge from './components/ActionableBadge';

const MyActivities = ({ classes, store: { ui } }) => {
  const selected = includes([Routes.SET, Routes.FINALIZE, Routes.WITHDRAW, Routes.ACTIVITY_HISTORY], ui.location)
    ? 'selected'
    : '';

  return (
    <NavLink to={Routes.ACTIVITY_HISTORY}>
      <div className={cx(classes.rightButtonContainer, classes.myActivitiesWrapper)}>
        <Button className={classes.myActivitiesButton}>
          <ActionableBadge className={classes.navBarMyActivitiesActionCount} />
          <Typography className={cx(classes.navButton, selected)}>
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Typography>
        </Button>
      </div>
    </NavLink>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer(MyActivities)));
