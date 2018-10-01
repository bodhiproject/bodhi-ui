import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid } from '@material-ui/core';

import theme from '../../../config/theme';
import EventCard from '../../../components/EventCard';
import Loading from '../../../components/EventListLoading';

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
        <Grid container spacing={theme.padding.sm.value}>
          {events}
        </Grid>
      </Fragment>
    );
  }
}
