import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  AppBar,
  Toolbar,
  Badge,
  Button,
  withStyles,
} from '@material-ui/core';
import cx from 'classnames';
import { Routes, EventStatus } from 'constants';
import { Link } from 'react-router-dom';

import NavLink from './components/NavLink';
import { faqUrls } from '../../config/app';
import styles from './styles';
import Tracking from '../../helpers/mixpanelUtil';
import ImageLocaleWrapper from './components/ImageLocaleWrapper';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
export default class NavBar extends Component {
  state = {
    dropdownDirection: 'down',
  }
  componentDidMount() {
    this.props.store.global.getActionableItemCount();
  }
  changeDropDownDirection() {
    if (this.state.dropdownDirection === 'down') this.setState({ dropdownDirection: 'up' });
    if (this.state.dropdownDirection === 'up') this.setState({ dropdownDirection: 'down' });
  }
  render() {
    const { classes } = this.props;
    this.changeDropDownDirection = this.changeDropDownDirection.bind(this);
    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <NavSection>
            <BodhiLogo {...this.props} />
            <QtumPrediction {...this.props} />
            <BotCourt {...this.props} />
          </NavSection>
          <MyActivities {...this.props} />
          <Toggle onClick={this.changeDropDownDirection}><div className={`icon iconfont icon-ic_${this.state.dropdownDirection}`}></div></Toggle>
          <Dropdown data-show={this.state.dropdownDirection === 'down'}>
            <Wallet {...this.props} />
            <Link to={Routes.ALL_EVENTS}>
              <Item onClick={this.changeDropDownDirection}>
                <FormattedMessage id="navBar.allEvents" defaultMessage="All Events" />
              </Item>
            </Link>
            <QAButton {...this.props} changeDropDownDirection={this.changeDropDownDirection} />
            <Link to={Routes.SETTINGS}>
              <Item onClick={this.changeDropDownDirection}>
                <FormattedMessage id="navBar.settings" defaultMessage="Settings" />
              </Item>
            </Link>
          </Dropdown>
        </Toolbar>
      </AppBar>
    );
  }
}

const QAButton = ({ intl, changeDropDownDirection }) => (
  <a
    onClick={() => {
      window.open(faqUrls[intl.locale], '_blank');
      Tracking.track('navBar-helpClick');
    }}
  >
    <Item onClick={changeDropDownDirection}>
      <FormattedMessage id="help" defaultMessage="Help" />
    </Item>
  </a>
);

const NavBarRightButtonContainer = styled.div`
  height: 70px;
  line-height: 70px;
  text-align: center;
  color: white;
  position: absolute;
  right: 70px;
  top: 0px;
  padding-left: 20px;
  padding-right: 20px;
  border-left: 1px solid rgba(0,0,0,0.2);
`;
const NavBarRightButton = styled.div`
  height: 30px;
  margin: 20px auto;
  line-height: 30px;
`;

const MyActivities = observer(({ store: { global } }) => {
  if (global.userData.totalCount > 0) {
    return (<Link to={Routes.ACTIVITY_HISTORY}>
      <NavBarRightButtonContainer>
        <NavBarRightButton>
          <Badge badgeContent={global.userData.totalCount} color="secondary">
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Badge>
        </NavBarRightButton>
      </NavBarRightButtonContainer>
    </Link>);
  }
  return (<NavLink to={Routes.ACTIVITY_HISTORY}>
    <NavBarRightButtonContainer>
      <NavBarRightButton>
        <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
      </NavBarRightButton>
    </NavBarRightButtonContainer>
  </NavLink>);
});

const Wallet = styled(({ store: { wallet } }) => {
  const totalQTUM = _.sumBy(wallet.addresses, ({ qtum }) => qtum).toFixed(2) || '0.00';
  const totalBOT = _.sumBy(wallet.addresses, ({ bot }) => bot).toFixed(2) || '0.00';
  return (<Link to={Routes.WALLET}>
    <Item>
      <WalletItem>
        <i className={cx('icon', 'iconfont', 'icon-ic_wallet')}></i>
      </WalletItem>
      <WalletItem>
        <div style={{ paddingBottom: '10px' }}><b>{totalQTUM}</b> QTUM</div>
        <div><b>{totalBOT}</b> BOT</div>
      </WalletItem>
      <WalletItem>{'>'}</WalletItem>
    </Item>
  </Link>);
})``;

const WalletItem = styled.div``;

const Dropdown = styled.div`
  background: white;
  box-shadow: 0px -2px 20px -2px rgba(0,0,0,0.2), 0px -2px 5px rgba(0,0,0,0.1);
  position: absolute;
  right: 0px;
  top: 70px;
  min-width: 275px;
  color: black;
  transition: 0.3s all ease-in-out;
  ${({ ...props }) => Boolean(props['data-show']) && css`
    display: none;
  `}
`;

const Item = styled.div`
  background: white;
  display: flex;
  text-align: left;
  padding: 25px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,0.15);
  justify-content: space-between;
  &:hover: {
    background: rgba(0,0,0,0.2);
  }
`;

const Toggle = styled.div`
  text-align: center;
  background: #4244BB !important;
  height: 70px;
  width: 70px;
  line-height: 70px;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
`;

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

// const MyActivities = observer(({ classes, store: { global } }) => {
//   let children = (
//     <Button className={cx(classes.navEventsButton, classes.dark)}>
//       <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
//     </Button>
//   );
//   if (global.userData.totalCount > 0) {
//     children = <Badge badgeContent={global.userData.totalCount} color="secondary">{children}</Badge>;
//   }
//   return <NavLink to={Routes.SET}>{children}</NavLink>;
// });

// const LanguageSelector = inject('store')(observer(({ classes, store: { ui } }) => (
//   <Select
//     value={ui.locale}
//     onChange={(e) => ui.changeLocale(e.target.value)}
//     name="lang"
//     disableUnderline
//     className={classes.selectMenu}
//   >
//     <MenuItem value="en-US" className={classes.langugae}>English</MenuItem>
//     <MenuItem value="zh-Hans-CN" className={classes.langugae}>中文</MenuItem>
//     <MenuItem value="ko-KR" className={classes.langugae}>한국어</MenuItem>
//   </Select>
// )));

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
