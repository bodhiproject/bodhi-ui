import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import TopActions from '../../components/TopActions';
import Loading from '../../components/EventListLoading';

@inject('store')
@observer
export default class QtumPrediction extends Component {
  componentDidMount() {
    this.props.store.qtumPrediction.init();
  }

  render() {
    const { list, loadMore, loadingMore, loading } = this.props.store.qtumPrediction;
    if (loading) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        <TopActions />
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
