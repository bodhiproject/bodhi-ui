import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Drawer, withStyles, Divider } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import styles from './styles';

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
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
      </Drawer>
    );
  }
}
