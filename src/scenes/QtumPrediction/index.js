import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import Loading from '../../components/EventListLoading';
import EventCard from '../../components/EventCard';
import TopActions from './components/TopActions';


@inject('store')
@observer
export default class QtumPrediction extends Component {
  componentDidMount() {
    this.props.store.qtumPrediction.init();
  }

  render() {
    const { list, loadMore, loadingMore, loaded } = this.props.store.qtumPrediction;
    if (!loaded) return <Loading />;
    const events = (list || []).map((event, i) => (
      <EventCard key={i} index={i} event={event} />
    ));
    return (
      <Fragment>
        {events.length > 0 && <TopActions />}
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
