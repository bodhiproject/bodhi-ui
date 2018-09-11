import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import theme from '../../../config/theme';
import InfiniteScroll from '../../../components/InfiniteScroll';
import EventCard from '../../../components/EventCard';
import Loading from '../../../components/EventListLoading';


@inject('store')
@observer
export default class Favorite extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { list, loadMore, loadingMore, loading } = this.props.store.favorite;
    if (loading) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        <InfiniteScroll
          spacing={theme.padding.sm.value}
          data={events}
          loadMore={loadMore}
          loadingMore={loadingMore}
        />
      </Fragment>
    );
  }
}
