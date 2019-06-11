import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import InfiniteScroll from '../../components/InfiniteScroll';
import EventCard from '../../components/EventCard';
import Loading from '../../components/EventListLoading';

@inject('store')
@observer
export default class Arbitration extends Component {
  componentDidMount() {
    this.props.store.arbitration.init();
  }

  render() {
    const { list, loadMore, loadingMore, loaded } = this.props.store.arbitration;
    if (!loaded) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />);
    return (
      <Fragment>
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
