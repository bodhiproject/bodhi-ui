import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AppBar, Collapse, Toolbar, withStyles, IconButton, Hidden } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import BodhiLogo from './Logo';
import Prediction from './Prediction';
import Arbitration from './Arbitration';
import { SearchButton, SearchBarField } from './Search';
import MyActivities from './MyActivities';
import { DropdownMenuButton, DropdownMenu } from './DropdownMenu';
import SearchResult from './components/SearchResult';
import styles from './styles';
import FavoriteDrawer from '../FavoriteDrawer';
import { Favorite } from './Favorite';

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
        this.props.store.search.fetchEvents();
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
            <div className={classes.navSection}>
              <BodhiLogo {...this.props} />
              <Hidden xsDown>
                <Prediction {...this.props} />
                <Arbitration {...this.props} />
              </Hidden>
              <Favorite />
            </div>
            <SearchButton classes={classes} />
            <Hidden xsDown>
              <MyActivities {...this.props} />
              <DropdownMenuButton />
            </Hidden>
            <Hidden smUp>
              <IconButton
                className={classes.menuButton}
                onClick={ui.toggleDropdownMenu}
                color="inherit"
                aria-label="Menu"
              >
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
        <Collapse in={ui.searchBarMode && !isEmpty(search.phrase)}>
          <SearchResult />
        </Collapse>
        <FavoriteDrawer />
      </AppBar>
    );
  }
}
