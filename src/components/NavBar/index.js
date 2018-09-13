import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  AppBar,
  Collapse,
  Toolbar,
  Badge,
  Button,
  withStyles,
  TextField,
} from '@material-ui/core';
import cx from 'classnames';
import { Routes, EventStatus } from 'constants';
import { Link } from 'react-router-dom';

import NavLink from './components/NavLink';
import { faqUrls } from '../../config/app';
import styles from './styles';
import Tracking from '../../helpers/mixpanelUtil';
import ImageLocaleWrapper from './components/ImageLocaleWrapper';
import SearchResult from './components/SearchResult';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class NavBar extends Component {
  componentDidMount() {
    this.props.store.global.getActionableItemCount();
  }
  changeDropDownDirection = () => {
    const { ui } = this.props.store;
    ui.dropdownDirection = ui.dropdownDirection === 'down' ? 'up' : 'down';
  }
  handleSearchBarKeyDown = event => {
    switch (event.key) {
      case 'Enter':
        this.props.store.search.init();
        break;
      default:
        break;
    }
  }
  render() {
    const { classes } = this.props;
    const { ui, search } = this.props.store;
    return (
      <AppBar className={ui.searchBarMode ? classes.navBarShadow : classes.navBar}>
        <Collapse in={!ui.searchBarMode}>
          <Toolbar className={classes.navBarWrapper}>
            <NavSection>
              <BodhiLogo {...this.props} />
              <QtumPrediction {...this.props} />
              <BotCourt {...this.props} />
            </NavSection>
            <SearchButton />
            <MyActivities {...this.props} />
            <Toggle onClick={this.changeDropDownDirection}><div className={`icon iconfont icon-ic_${ui.dropdownDirection}`}></div></Toggle>
          </Toolbar>
        </Collapse>
        <Dropdown data-show={ui.dropdownDirection === 'down'}>
          <Wallet {...this.props} />
          <Link to={Routes.ALL_EVENTS}>
            <Item onClick={this.changeDropDownDirection}>
              <FormattedMessage id="navBar.allEvents" defaultMessage="All Events" />
            </Item>
          </Link>
          <Link to={Routes.SETTINGS}>
            <Item onClick={this.changeDropDownDirection}>
              <FormattedMessage id="navBar.settings" defaultMessage="Settings" />
            </Item>
          </Link>
          <QAButton {...this.props} changeDropDownDirection={this.changeDropDownDirection} />
        </Dropdown>
        <Collapse in={ui.searchBarMode}>
          <Toolbar className={classes.searchBarWrapper}>
            <SearchBarField onSearchBarKeyDown={this.handleSearchBarKeyDown} />
          </Toolbar>
        </Collapse>
        <Collapse in={ui.searchBarMode && !_.isEmpty(search.phrase)}>
          <SearchResult />
        </Collapse>
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
  padding-left: 20px;
  padding-right: 20px;
  border-left: 1px solid rgba(0,0,0,0.2);
  display: flex;
`;
const NavBarRightButton = styled.div`
  height: 30px;
  margin: 20px auto;
  line-height: 30px;
  display: flex;
`;
const SearchBarFont = styled.div`
  color: rgba(255, 255, 255, 0.65);
  padding-left: 14px;
`;
const DivSearchBarField = styled.div`
  margin: auto;
  display: flex;
  width: 90%;
`;

const SearchBarField = injectIntl(withStyles(styles, { withTheme: true })(inject('store')(({ intl, classes, store: { search, ui }, onSearchBarKeyDown }) => (
  <DivSearchBarField>
    <div className={`icon iconfont icon-ic_search ${classes.searchBarLeftIcon}`} />
    <TextField
      placeholder={intl.formatMessage({ id: 'search.placeholder', defaultMessage: 'Type to begin search' })}
      className={classes.searchBarTextField}
      InputProps={{
        autoFocus: true,
        disableUnderline: true,
        classes: {
          input: classes.searchBarInput,
          root: classes.searchBarInputBase,
        },
        onKeyDown: (e) => onSearchBarKeyDown(e),
        onChange: e => {
          search.phrase = e.target.value;
          search.loading = true;
          _.debounce(search.init, 1500)();
        },
        value: search.phrase,
        inputProps: {
          id: 'searchEventInput',
        },
      }}
    >
    </TextField>
    <div className="icon iconfont icon-ic_close" onClick={ui.disableSearchBarMode} />
  </DivSearchBarField>
))));

const MyActivities = observer(({ store: { global } }) => {
  if (global.userData.totalCount > 0) {
    return (<NavLink to={Routes.ACTIVITY_HISTORY}>
      <NavBarRightButtonContainer>
        <NavBarRightButton>
          <Badge badgeContent={global.userData.totalCount} color="secondary">
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Badge>
        </NavBarRightButton>
      </NavBarRightButtonContainer>
    </NavLink>);
  }
  return (<NavLink to={Routes.ACTIVITY_HISTORY}>
    <NavBarRightButtonContainer>
      <NavBarRightButton>
        <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
      </NavBarRightButton>
    </NavBarRightButtonContainer>
  </NavLink>);
});

const SearchButton = inject('store')(observer(({ store: { ui } }) => (
  <NavBarRightButtonContainer onClick={ui.enableSearchBarMode}>
    <NavBarRightButton>
      <div className="icon iconfont icon-ic_search" />
      <SearchBarFont>
        <FormattedMessage id="str.search" defaultMessage="Search" />
      </SearchBarFont>
    </NavBarRightButton>
  </NavBarRightButtonContainer>
)));

const Wallet = styled(({ store: { wallet } }) => {
  // Local wallet means transactions are handled via a local wallet program, eg. Qtum Wallet.
  if (process.env.LOCAL_WALLET === 'false') {
    return null;
  }

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

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
