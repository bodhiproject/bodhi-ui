import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AppBar, Collapse, Toolbar, withStyles, TextField, IconButton, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import cx from 'classnames';
import { Routes } from 'constants';
import { Link } from 'react-router-dom';

import BodhiLogo from './Logo';
import QtumPrediction from './QtumPrediction';
import BotCourt from './BotCourt';
import Wallet from './Wallet';
import SearchButton from './SearchButton';
import MyActivities from './MyActivities';
import HelpButton from './HelpButton';
import SearchResult from './components/SearchResult';
import styles from './styles';


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
              <Hidden xsDown>
                <QtumPrediction {...this.props} />
                <BotCourt {...this.props} />
              </Hidden>
            </NavSection>
            <SearchButton classes={classes} />
            <Wallet />
            <Hidden xsDown>
              <MyActivities {...this.props} />
              <Toggle className={classes.navToggle} onClick={this.changeDropDownDirection}>
                <div className={cx(classes.navToggleIcon, `icon iconfont icon-ic_${ui.dropdownDirection}`)}></div>
              </Toggle>
            </Hidden>
            <Hidden smUp>
              <IconButton className={classes.menuButton} onClick={this.changeDropDownDirection} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Collapse>
        <Dropdown className={classes.navDropdown} data-show={ui.dropdownDirection === 'down'}>
          <Hidden smUp>
            <Wallet />
            <Link to={Routes.QTUM_PREDICTION}>
              <Item className={classes.navDropdownLinkItem} onClick={this.changeDropDownDirection}>
                <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
              </Item>
            </Link>
            <Link to={Routes.BOT_COURT}>
              <Item className={classes.navDropdownLinkItem} onClick={this.changeDropDownDirection}>
                <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
              </Item>
            </Link>
            <Link to={Routes.ACTIVITY_HISTORY}>
              <Item className={classes.navDropdownLinkItem} onClick={this.changeDropDownDirection}>
                <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
              </Item>
            </Link>
          </Hidden>
          <Link to={Routes.ALL_EVENTS}>
            <Item className={classes.navDropdownLinkItem} onClick={this.changeDropDownDirection}>
              <FormattedMessage id="navBar.allEvents" defaultMessage="All Events" />
            </Item>
          </Link>
          <Link to={Routes.SETTINGS}>
            <Item className={classes.navDropdownLinkItem} onClick={this.changeDropDownDirection}>
              <FormattedMessage id="navBar.settings" defaultMessage="Settings" />
            </Item>
          </Link>
          <HelpButton {...this.props} changeDropDownDirection={this.changeDropDownDirection} />
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

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
