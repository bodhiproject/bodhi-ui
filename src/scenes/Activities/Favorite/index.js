import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Typography, withStyles, Button } from '@material-ui/core';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Routes } from 'constants';

import theme from '../../../config/theme';
import EventCard from '../../../components/EventCard';
import FavoriteCard from '../../../components/FavoriteCard';
import Loading from '../../../components/EventListLoading';
import EmptyPlaceholder from '../../../components/EmptyPlaceholder';
import styles from './styles';

const messages = defineMessages({
  emptyFavMsg: {
    id: 'str.emptyFavorite',
    defaultMessage: 'You do not have any favorite events right now.',
  },
});

@inject('store')
@withStyles(styles, { withTheme: true })
@injectIntl
@observer
export default class Favorite extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { intl, classes } = this.props;
    const { ui, favorite: { displayList, loading } } = this.props.store;
    if (loading) return <Loading />;
    let events;
    if (!!this.props.bannerStyle) events = (displayList || []).map((event, i) => <FavoriteCard key={i} index={i} event={event} onClick={ui.hideFavoriteDrawer} />); // eslint-disable-line
    else events = (displayList || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        {displayList.length ? (
          <Grid container spacing={this.props.bannerStyle ? theme.padding.spaceX.value : theme.padding.space3X.value}>
            {events}
          </Grid>
        ) : (
          <Fragment>
            {this.props.bannerStyle ? (
              <div className={classes.favoriteSidebarPlacholderContainer}>
                <div className={classes.favoriteSidebarPlacholderText}>
                  <Typography variant="title">
                    {intl.formatMessage({ id: messages.emptyFavMsg.id, defaultMessage: messages.emptyFavMsg.defaultMessage })}
                  </Typography>
                </div>
                <Link to={Routes.QTUM_PREDICTION} className={classes.favoriteSidebarPlacholderButton}>
                  <Button
                    variant="raised"
                    size="medium"
                    color="primary"
                    onClick={ui.hideFavoriteDrawer}
                  >
                    {intl.formatMessage({ id: 'str.discoverEvents', defaultMessage: 'Discover Events' })}
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyPlaceholder message={messages.emptyFavMsg} />
            )
            }
          </Fragment>
        )}
      </Fragment>
    );
  }
}
