import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Drawer, Grid, Typography, Button, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { EventListLoading, FavoriteCard } from 'components';
import { Routes } from 'constants';
import styles from './styles';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class FavoriteDrawer extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  // TODO: add grid spacing unit via JSS
  renderItems = (events) => (
    <div>
      <Grid container>
        {events}
      </Grid>
    </div>
  )

  renderEmptyMessage = () => {
    const { classes } = this.props;
    const { ui } = this.props.store;

    return (
      <div className={classes.favoriteSidebarPlacholderContainer}>
        <div className={classes.favoriteSidebarPlacholderText}>
          <Typography variant="h6">
            <FormattedMessage
              id="str.emptyFavorite"
              defaultMessage="You do not have any favorite events right now."
            />
          </Typography>
        </div>
        <Link
          to={Routes.PREDICTION}
          className={classes.favoriteSidebarPlacholderButton}
        >
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={ui.hideFavoriteDrawer}
          >
            <FormattedMessage
              id="str.discoverEvents"
              defaultMessage="Discover Events"
            />
          </Button>
        </Link>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { ui, favorite: { displayList, loading } } = this.props.store;

    if (loading) return <EventListLoading />;

    const events = displayList.map((event, i) => (
      <FavoriteCard
        key={i}
        index={i}
        event={event}
        onClick={ui.hideFavoriteDrawer}
      />
    ));

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
          {ui.favoriteDrawerOpen &&
            events.length > 0
            ? this.renderItems(events)
            : this.renderEmptyMessage()
          }
        </div>
      </Drawer>
    );
  }
}
