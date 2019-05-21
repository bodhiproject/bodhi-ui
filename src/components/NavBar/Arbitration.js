import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Routes, EventStatus } from 'constants';
import cx from 'classnames';

import styles from './styles';
import NavLink from './components/NavLink';

const Arbitration = ({ classes, store: { ui } }) => (
  <NavLink to={Routes.ARBITRATION}>
    <Button
      data-index={EventStatus.VOTE}
      className={cx(
        classes.navButton,
        ui.location === Routes.ARBITRATION ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.arbitration" defaultMessage="Arbitration" />
    </Button>
  </NavLink>
);

export default withStyles(styles, { withTheme: true })(inject('store')(observer(Arbitration)));
