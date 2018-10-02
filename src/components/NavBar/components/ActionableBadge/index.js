import React from 'react';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';

const ActionableBadge = ({ classes, className, store: { global } }) => {
  const actionableCount = global.userData.totalCount;
  return actionableCount > 0 && (
    <div className={cx(classes.myActivitiesActionableCount, className)}>{actionableCount}</div>
  );
};

export default withStyles(styles, { withTheme: true })(inject('store')(observer(ActionableBadge)));
