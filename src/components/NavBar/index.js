import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AppBar, Collapse, Toolbar, withStyles, TextField, IconButton, Hidden } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import _ from 'lodash';

import BodhiLogo from './Logo';
import QtumPrediction from './QtumPrediction';
import BotCourt from './BotCourt';
import Wallet from './Wallet';
import SearchButton from './SearchButton';
import MyActivities from './MyActivities';
import { DropdownMenuButton, DropdownMenu } from './DropdownMenu';
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
            <Hidden xsDown>
              <Wallet />
              <MyActivities {...this.props} />
              <DropdownMenuButton />
            </Hidden>
            <Hidden smUp>
              <IconButton className={classes.menuButton} onClick={ui.toggleDropdownMenu} color="inherit" aria-label="Menu">
                <Menu />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Collapse>
        <DropdownMenu />
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

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);
