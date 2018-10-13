import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Drawer, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import styles from './styles';
import FavoritePage from '../../scenes/Activities/Favorite';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class FavoriteDrawer extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { classes } = this.props;
    const { ui } = this.props.store;

    return (
      <Drawer
        open={ui.favoriteDrawerOpen}
        className={classes.drawerUnderNavbar}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          onBackdropClick: ui.hideFavoriteDrawer,
        }}
        anchor="left"
      >
        <div className={classes.drawerContainer}>
          {ui.favoriteDrawerOpen && <FavoritePage bannerStyle />}
        </div>
      </Drawer>
    );
  }
}
