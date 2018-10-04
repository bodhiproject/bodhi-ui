import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import theme from '../../../config/theme';
import EventCard from '../../../components/EventCard';
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
    const { displayList, loading } = this.props.store.favorite;
    if (loading) return <Loading />;
    const events = (displayList || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        {displayList.length ? (
          <Grid container spacing={theme.padding.sm.value}>
            {events}
          </Grid>
        ) : (
          <EmptyPlaceholder message={messages.emptyFavMsg} />
        )}
      </Fragment>
    );
  }
}
