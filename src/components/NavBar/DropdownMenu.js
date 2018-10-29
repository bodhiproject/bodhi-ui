import React from 'react';
import { withStyles, Hidden, IconButton, Badge, Backdrop } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { Routes } from 'constants';

import styles from './styles';
import ActionableBadge from './components/ActionableBadge';

export const DropdownMenuButton = withStyles(styles)(inject('store')(observer(({ classes, store: { ui } }) => (
  <div className={classes.rightButtonContainer}>
    <IconButton className={classes.navButton} onClick={ui.toggleDropdownMenu}>
      {ui.dropdownMenuOpen ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  </div>
))));

export const DropdownMenu = withStyles(styles)(inject('store')(observer(({ classes, store: { ui, qrypto } }) => (
  <div className={cx(classes.navDropdown, ui.dropdownMenuOpen ? '' : 'hide')}>
    <Hidden smUp>
      <Link to={Routes.QTUM_PREDICTION}>
        <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
          <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
        </div>
      </Link>
      <Link to={Routes.BOT_COURT}>
        <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
          <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
        </div>
      </Link>
      <Link to={Routes.ACTIVITY_HISTORY}>
        <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
          <div className={classes.navDropdownMyActivitiesContainer}>
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
            <ActionableBadge className={classes.dropdownMyActivitiesCount} />
          </div>
        </div>
      </Link>
    </Hidden>
    <Link to={Routes.ALL_EVENTS}>
      <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
        <FormattedMessage id="navBar.allEvents" defaultMessage="All Events" />
      </div>
    </Link>
    <Link to={Routes.LEADERBOARD}>
      <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
        <FormattedMessage id="navBar.leaderboard" defaultMessage="Leaderboard" />
      </div>
    </Link>
    <Hidden smUp>
      <div
        className={classes.navDropdownLinkItem}
        onClick={() => {
          ui.toggleDropdownMenu();
          qrypto.openPopover();
        }}
      >
        <Badge
          classes={{ badge: classes.walletStatusBadge }}
          color={qrypto.loggedIn ? 'secondary' : 'error'}
          badgeContent=""
        >
          <FormattedMessage id="str.wallet" defaultMessage="Wallet" />
        </Badge>
      </div>
    </Hidden>
    <Link to={Routes.SETTINGS}>
      <div className={classes.navDropdownLinkItem} onClick={ui.toggleDropdownMenu}>
        <FormattedMessage id="navBar.settings" defaultMessage="Settings" />
      </div>
    </Link>
    <div className={classes.navDropdownLinkItem} onClick={ui.onHelpButtonClick}>
      <FormattedMessage id="help" defaultMessage="Help" />
    </div>
    <Backdrop invisible open={ui.dropdownMenuOpen} onClick={ui.toggleDropdownMenu} />
  </div>
))));
