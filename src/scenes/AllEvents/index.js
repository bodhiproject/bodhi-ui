import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from '../../components/InfiniteScroll';
import EventCard from '../../components/EventCard';
import Loading from '../../components/EventListLoading';

@inject('store')
@observer
export default class AllEvents extends Component {
  componentDidMount() {
    this.props.store.allEvents.init();
  }

  render() {
    const { allEvents } = this.props.store;
    return (
      <Fragment>
        <Events allEvents={allEvents} />
      </Fragment>
    );
  }
}

const Events = observer(({ allEvents: { list, loadMoreEvents, loaded, loadingMore } }) => {
  if (!loaded) return <Loading />;
  const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
  return (
    <InfiniteScroll
      spacing={2}
      data={events}
      loadMore={loadMoreEvents}
      loadingMore={loadingMore}
    />
  );
});
