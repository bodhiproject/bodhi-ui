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
        anchor="left"
      >
        {ui.favoriteDrawerOpen && <FavoritePage bannerStyle />}
      </Drawer>
    );
  }
}
