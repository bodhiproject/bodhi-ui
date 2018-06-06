import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { AppBar, Toolbar, Badge, Button, withStyles, Select } from 'material-ui';
import cx from 'classnames';
import { MenuItem } from 'material-ui/Menu';

import { Link } from './components/Link/index';
import { NavLink } from './components/NavLink/index';
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
});

@withStyles(sportStyles, { withTheme: true })
@withStyles(styles, { withTheme: true })
@injectIntl
@connect((state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
}))
export default class NavBar extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    actionableItemCount: PropTypes.object,
    langHandler: PropTypes.func,
    appLocation: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
  }

  static defaultProps = {
    actionableItemCount: undefined,
    langHandler: undefined,
  }

  constructor(props) {
    super(props);
    this.renderActivitiesButtonWithBadge = this.renderActivitiesButtonWithBadge.bind(this);
    this.getTotalQTUM = this.getTotalQTUM.bind(this);
    this.getTotalBOT = this.getTotalBOT.bind(this);
  }

  handleChange = (event) => {
    this.props.langHandler(event.target.value);
  };

  render() {
    const { classes, appLocation, lang } = this.props;
    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <NavSection>
            <Link to={RouterPath.qtumPrediction}>
              <img
                src="/images/sports-logo.svg"
                alt="bodhi-logo"
                className={classes.navBarLogo}
              />
            </Link>
            <NavLink to={RouterPath.qtumPrediction}>
              <Button
                data-index={EventStatus.Bet}
                className={cx(
                  classes.navEventsButton,
                  appLocation === AppLocation.qtumPrediction || appLocation === AppLocation.bet ? 'selected' : '',
                )}
              >
                <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
              </Button>
            </NavLink>
            <NavLink to={RouterPath.botCourt}>
              <Button
                data-index={EventStatus.Vote}
                className={cx(
                  classes.navEventsButton,
                  appLocation === AppLocation.botCourt || appLocation === AppLocation.vote ? 'selected' : '',
                )}
              >
                <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
              </Button>
            </NavLink>
          </NavSection>
          <NavSection>
            <NavLink to="/my-wallet">
              <Button className={classes.navBarWalletButton}>
                <i className={cx('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
                {`${this.getTotalQTUM()} QTUM / ${this.getTotalBOT()} BOT`}
              </Button>
            </NavLink>
            <Select
              value={lang}
              onChange={this.handleChange}
              name="lang"
              disableUnderline
              className={classes.selectMenu}
            >
              <MenuItem value="en-US" className={classes.langugae}>English</MenuItem>
              <MenuItem value="zh-Hans-CN" className={classes.langugae}>中文</MenuItem>
              <MenuItem value="ko-KR" className={classes.langugae}>한국어</MenuItem>
            </Select>
            {this.renderActivitiesButtonWithBadge()}
            <HelpButton onClick={this.onHelpButtonClick} classes={classes} />
          </NavSection>
        </Toolbar>
      </AppBar>
    );
  }

  renderActivitiesButtonWithBadge() {
    const { classes, actionableItemCount } = this.props;

    if (actionableItemCount.totalCount > 0) {
      return (
        <NavLink to={RouterPath.set}>
          <Badge badgeContent={actionableItemCount.totalCount} color="secondary">
            <Button className={cx(classes.navEventsButton, classes.dark)}>
              <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
            </Button>
          </Badge>
        </NavLink>
      );
    }

    return (
      <NavLink to={RouterPath.set}>
        <Button className={cx(classes.navEventsButton, classes.dark)}>
          <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
        </Button>
      </NavLink>
    );
  }

  getTotalQTUM() {
    const { walletAddresses } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.qtum ? wallet.qtum : 0);
    }

    return total.toFixed(2);
  }

  getTotalBOT() {
    const { walletAddresses } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.bot ? wallet.bot : 0);
    }

    return total.toFixed(2);
  }

  onHelpButtonClick = () => {
    window.open(faqUrls[this.props.intl.locale], '_blank');
    Tracking.track('navBar-helpClick');
  }
}

const HelpButton = injectIntl(({ classes, intl, ...props }) => (
  <Button className={cx(classes.faq, classes.navEventsButton, classes.dark)} {...props}>
    <i className={cx('icon iconfont icon-ic_question', classes.questionIcon)} /> {intl.formatMessage(messages.help)}
  </Button>
));

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
