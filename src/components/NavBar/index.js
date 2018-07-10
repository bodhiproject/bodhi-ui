import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import {
  AppBar,
  Toolbar,
  Badge,
  Button,
  withStyles,
  Select,
  MenuItem,
} from '@material-ui/core';
import cx from 'classnames';
import { Routes, EventStatus } from 'constants';

import { Link } from './components/Link';
import NavLink from './components/NavLink';
import { faqUrls } from '../../config/app';
import styles from './styles';
import sportStyles from './sportStyles';
import Tracking from '../../helpers/mixpanelUtil';


const messages = defineMessages({
  help: {
    id: 'help',
    defaultMessage: 'Help',
  },
  allEvents: {
    id: 'navbar.allEvents',
    defaultMessage: 'All Events',
  },
});

@withStyles(sportStyles)
@withStyles(styles, { withTheme: true })
@injectIntl
@connect((state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
}))
@inject('store')
export default class NavBar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <NavSection>
            <BodhiLogo {...this.props} />
            <QtumPrediction {...this.props} />
            <BotCourt {...this.props} />
          </NavSection>
          <NavSection>
            <Wallet {...this.props} />
            <MyActivities {...this.props} />
            <HelpButton {...this.props} />
            <LanguageSelector {...this.props} />
            <AllEvents {...this.props} />
          </NavSection>
        </Toolbar>
      </AppBar>
    );
  }
}

const BodhiLogo = ({ classes }) => (
<<<<<<< HEAD
  <Link to={Routes.QTUM_PREDICTION}>
=======
  <Link to={AppLocation.QTUM_PREDICTION}>
>>>>>>> change all, all testing passed
    <img
      src="/images/sports-logo.svg"
      alt="bodhi-logo"
      className={classes.navBarLogo}
    />
  </Link>
);

const QtumPrediction = observer(({ classes, store: { ui } }) => (
<<<<<<< HEAD
  <NavLink to={Routes.QTUM_PREDICTION}>
=======
  <NavLink to={AppLocation.QTUM_PREDICTION}>
>>>>>>> change all, all testing passed
    <Button
      data-index={EventStatus.BET}
      className={cx(
        classes.navEventsButton,
<<<<<<< HEAD
        ui.location === Routes.QTUM_PREDICTION || ui.location === Routes.bet ? 'selected' : '',
=======
        ui.location === AppLocation.QTUM_PREDICTION || ui.location === AppLocation.bet ? 'selected' : '',
>>>>>>> change all, all testing passed
      )}
    >
      <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
    </Button>
  </NavLink>
));

const BotCourt = observer(({ classes, store: { ui } }) => (
<<<<<<< HEAD
  <NavLink to={Routes.BOT_COURT}>
=======
  <NavLink to={AppLocation.BOT_COURT}>
>>>>>>> change all, all testing passed
    <Button
      data-index={EventStatus.VOTE}
      className={cx(
        classes.navEventsButton,
<<<<<<< HEAD
        ui.location === Routes.BOT_COURT ? 'selected' : '',
=======
        ui.location === AppLocation.BOT_COURT || ui.location === AppLocation.BOT_COURT ? 'selected' : '',
>>>>>>> change all, all testing passed
      )}
    >
      <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
    </Button>
  </NavLink>
));

const Wallet = ({ classes, walletAddresses }) => {
  const totalQTUM = _.sumBy(walletAddresses, ({ qtum }) => qtum).toFixed(2) || '0.00';
  const totalBOT = _.sumBy(walletAddresses, ({ bot }) => bot).toFixed(2) || '0.00';
  return (
<<<<<<< HEAD
    <NavLink to={Routes.WALLET}>
=======
    <NavLink to={AppLocation.WALLET}>
>>>>>>> change all, all testing passed
      <Button className={classes.marginRightButton}>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
        {`${totalQTUM} QTUM / ${totalBOT} BOT`}
      </Button>
    </NavLink>
  );
};

const MyActivities = ({ classes, store }) => {
  let children = (
    <Button className={cx(classes.navEventsButton, classes.dark)}>
      <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
    </Button>
  );
  if (store.navBar.myActivitesCount > 0) {
    children = <Badge badgeContent={store.navBar.myActivitesCount} color="secondary">{children}</Badge>;
  }
<<<<<<< HEAD
  return <NavLink to={Routes.SET}>{children}</NavLink>;
=======
  return <NavLink to={AppLocation.SET}>{children}</NavLink>;
>>>>>>> change all, all testing passed
};

const HelpButton = ({ classes, intl }) => (
  <Button
    className={cx(classes.faq, classes.navEventsButton, classes.dark)}
    onClick={() => {
      window.open(faqUrls[intl.locale], '_blank');
      Tracking.track('navBar-helpClick');
    }}
  >
    <i className={cx('icon iconfont icon-ic_question', classes.questionIcon)} /> {intl.formatMessage(messages.help)}
  </Button>
);

const LanguageSelector = inject('store')(observer(({ classes, store: { ui } }) => (
  <Select
    value={ui.locale}
    onChange={(e) => ui.changeLocale(e.target.value)}
    name="lang"
    disableUnderline
    className={classes.selectMenu}
  >
    <MenuItem value="en-US" className={classes.langugae}>English</MenuItem>
    <MenuItem value="zh-Hans-CN" className={classes.langugae}>中文</MenuItem>
    <MenuItem value="ko-KR" className={classes.langugae}>한국어</MenuItem>
  </Select>
)));

const AllEvents = ({ classes }) => (
<<<<<<< HEAD
  <NavLink to={Routes.ALL_EVENTS}>
=======
  <NavLink to={AppLocation.ALL_EVENTS}>
>>>>>>> change all, all testing passed
    <Button className={classes.marginRightButton}>
      <FormattedMessage id="navbar.allEvents" defaultMessage="All Events" />
    </Button>
  </NavLink>
);

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
