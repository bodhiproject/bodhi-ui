import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AppBar, Collapse, Toolbar, withStyles, IconButton, Hidden } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import styles from './styles';
import BodhiLogo from './Logo';
import Prediction from './Prediction';
import Arbitration from './Arbitration';
import SearchField from './SearchField';
import SearchButton from './SearchButton';
import MyActivities from './MyActivities';
import { DropdownMenuButton, DropdownMenu } from './DropdownMenu';
import SearchResult from './components/SearchResult';
import { Favorite } from './Favorite';

let timeout;
@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class NavBar extends Component {
  componentDidMount() {
    this.props.store.global.getActionableItemCount();
  }

  state = {
    clickCount: 0,
  }

  handleClickLogo = () => {
    clearTimeout(timeout);
    const { clickCount } = this.state;
    this.setState({ clickCount: clickCount + 1 });
    if (clickCount + 1 === 18) document.getElementsByTagName('audio')[0].play();
    timeout = setTimeout(() => this.setState({ clickCount: 0 }), 500);
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
              <BodhiLogo {...this.props} onClick={() => this.handleClickLogo()} />
              {
                // eslint-disable-next-line
                <audio className={classes.audio} src="/music/bgm.mp3" />
              }
              <Hidden xsDown>
                <Prediction {...this.props} />
                <Arbitration {...this.props} />
              </Hidden>
              <Favorite {...this.props} />
            </div>
            <SearchButton />
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
            {ui.searchBarMode && <SearchField onSearchBarKeyDown={this.handleSearchBarKeyDown} />}
          </Toolbar>
        </Collapse>
        <Collapse in={ui.searchBarMode && !isEmpty(search.phrase)}>
          <SearchResult />
        </Collapse>
      </AppBar>
    );
  }
}
