import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
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
import Tracking from '../../helpers/mixpanelUtil';
import ImageLocaleWrapper from './components/ImageLocaleWrapper';


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

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
export default class NavBar extends Component {
  componentDidMount() {
    this.props.store.global.getActionableItemCount();
  }
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
  <Link to={Routes.QTUM_PREDICTION}>
    <ImageLocaleWrapper
      appliedLanguages={['zh-Hans-CN']}
      src="/images/bodhi-logo.svg"
      alt="bodhi-logo"
      className={classes.navBarLogo}
    />
  </Link>
);

const QtumPrediction = observer(({ classes, store: { ui } }) => (
  <NavLink to={Routes.QTUM_PREDICTION}>
    <Button
      data-index={EventStatus.BET}
      className={cx(
        classes.navEventsButton,
        ui.location === Routes.QTUM_PREDICTION || ui.location === Routes.bet ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
    </Button>
  </NavLink>
));

const BotCourt = observer(({ classes, store: { ui } }) => (
  <NavLink to={Routes.BOT_COURT}>
    <Button
      data-index={EventStatus.VOTE}
      className={cx(
        classes.navEventsButton,
        ui.location === Routes.BOT_COURT ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
    </Button>
  </NavLink>
));

const Wallet = observer(({ classes, store: { wallet } }) => {
  const totalQTUM = _.sumBy(wallet.addresses, ({ qtum }) => qtum).toFixed(2) || '0.00';
  const totalBOT = _.sumBy(wallet.addresses, ({ bot }) => bot).toFixed(2) || '0.00';
  return (
    <NavLink to={Routes.WALLET}>
      <Button className={classes.marginRightButton}>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
        {`${totalQTUM} QTUM / ${totalBOT} BOT`}
      </Button>
    </NavLink>
  );
});

const MyActivities = observer(({ classes, store: { global } }) => {
  let children = (
    <Button className={cx(classes.navEventsButton, classes.dark)}>
      <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
    </Button>
  );
  if (global.userData.totalCount > 0) {
    children = <Badge badgeContent={global.userData.totalCount} color="secondary">{children}</Badge>;
  }
  return <NavLink to={Routes.SET}>{children}</NavLink>;
});

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
  <NavLink to={Routes.ALL_EVENTS}>
    <Button className={classes.marginRightButton}>
      <FormattedMessage id="navbar.allEvents" defaultMessage="All Events" />
    </Button>
  </NavLink>
);

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
