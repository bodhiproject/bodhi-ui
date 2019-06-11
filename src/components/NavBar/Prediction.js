import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Routes, EventStatus } from 'constants';
import cx from 'classnames';

import styles from './styles';
import NavLink from './components/NavLink';

const Prediction = observer(({ classes, store: { ui } }) => (
  <NavLink to={Routes.PREDICTION}>
    <Button
      data-index={EventStatus.BET}
      className={cx(
        classes.navButton,
        ui.location === Routes.PREDICTION || ui.location === Routes.bet ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.prediction" defaultMessage="Prediction" />
    </Button>
  </NavLink>
));

export default withStyles(styles, { withTheme: true })(inject('store')(observer(Prediction)));
