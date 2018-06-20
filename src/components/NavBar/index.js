import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
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

import { Link } from './components/Link';
import NavLink from './components/NavLink';
import { RouterPath, AppLocation, EventStatus } from '../../constants';
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
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    actionableItemCount: PropTypes.object,
  }

  static defaultProps = {
    actionableItemCount: undefined,
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
  <Link to={RouterPath.qtumPrediction}>
    <img
      src="/images/sports-logo.svg"
      alt="bodhi-logo"
      className={classes.navBarLogo}
    />
  </Link>
);

const QtumPrediction = observer(({ classes, store: { ui } }) => (
  <NavLink to={RouterPath.qtumPrediction}>
    <Button
      data-index={EventStatus.Bet}
      className={cx(
        classes.navEventsButton,
        ui.location === AppLocation.qtumPrediction || ui.location === AppLocation.bet ? 'selected' : '',
      )}
    >
      <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
    </Button>
  </NavLink>
));

const BotCourt = observer(({ classes, store: { ui } }) => (
  <NavLink to={RouterPath.botCourt}>
    <Button
      data-index={EventStatus.Vote}
      className={cx(
        classes.navEventsButton,
        ui.location === AppLocation.botCourt || ui.location === AppLocation.vote ? 'selected' : '',
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
    <NavLink to="/my-wallet">
      <Button className={classes.marginRightButton}>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
        {`${totalQTUM} QTUM / ${totalBOT} BOT`}
      </Button>
    </NavLink>
  );
};

const MyActivities = ({ classes, actionableItemCount }) => {
  let children = (
    <Button className={cx(classes.navEventsButton, classes.dark)}>
      <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
    </Button>
  );
  if (actionableItemCount.totalCount > 0) {
    children = <Badge badgeContent={actionableItemCount.totalCount} color="secondary">{children}</Badge>;
  }
  return <NavLink to={RouterPath.set}>{children}</NavLink>;
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
  <NavLink to={RouterPath.allEvents}>
    <Button className={classes.marginRightButton}>
      <FormattedMessage id="navbar.allEvents" defaultMessage="All Events" />
    </Button>
  </NavLink>
);

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
