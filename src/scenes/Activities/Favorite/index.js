import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import theme from '../../../config/theme';
import EventCard from '../../../components/EventCard';
import FavoriteCard from '../../../components/FavoriteCard';
import Loading from '../../../components/EventListLoading';
import EmptyPlaceholder from '../../../components/EmptyPlaceholder';

const messages = defineMessages({
  emptyFavMsg: {
    id: 'str.emptyFavorite',
    defaultMessage: 'You do not have any favorite events right now.',
  },
});

@inject('store')
@observer
export default class Favorite extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { ui, favorite: { displayList, loading } } = this.props.store;
    if (loading) return <Loading />;
    let events;
    if (!!this.props.bannerStyle) events = (displayList || []).map((event, i) => <FavoriteCard key={i} index={i} event={event} onClick={ui.hideFavoriteDrawer} />); // eslint-disable-line
    else events = (displayList || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        {displayList.length ? (
          <Grid container spacing={this.props.bannerStyle ? theme.padding.unit.value : theme.padding.sm.value}>
            {events}
          </Grid>
        ) : (
          <EmptyPlaceholder message={messages.emptyFavMsg} />
        )}
      </Fragment>
    );
  }
}
