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

  // TODO: add grid spacing unit via JSS?
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
      <div className={classes.emptyContainer}>
        <div className={classes.emptyTextContainer}>
          <Typography variant="h6">
            <FormattedMessage
              id="str.emptyFavorite"
              defaultMessage="You do not have any favorite events right now."
            />
          </Typography>
        </div>
        <Link
          to={Routes.PREDICTION}
          className={classes.emptyButtonContainer}
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
    const { favorite } = this.props.store;
    const { visible, loading, favEvents } = favorite;

    if (loading) return <EventListLoading />;

    const events = favEvents.map((event, i) => (
      <FavoriteCard
        key={i}
        index={i}
        event={event}
        onClick={favorite.hideDrawer}
      />
    ));

    return (
      <Drawer
        open={visible}
        className={classes.drawerUnderNavbar}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          onBackdropClick: favorite.hideDrawer,
        }}
        anchor="left"
      >
        <div className={classes.drawerContainer}>
          {visible &&
            events.length > 0
            ? this.renderItems(events)
            : this.renderEmptyMessage()
          }
        </div>
      </Drawer>
    );
  }
}
