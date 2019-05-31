import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import TopActions from '../../components/TopActions';
import Loading from '../../components/EventListLoading';

@inject('store')
@observer
export default class Favorite extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { list, loadMore, loadingMore, loaded } = this.props.store.favorite;

    if (!loaded) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />);
    return (
      <Fragment>
        {events.length > 0 && <TopActions />}
        <InfiniteScroll
          spacing={2}
          data={events}
          loadMore={loadMore}
          loadingMore={loadingMore}
        />
      </Fragment>
    );
  }
}
