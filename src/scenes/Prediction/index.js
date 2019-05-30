import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import Loading from '../../components/EventListLoading';
import EventCard from '../../components/EventCard';
import TopActions from './components/TopActions';

@inject('store')
@observer
export default class Prediction extends Component {
  componentDidMount() {
    this.props.store.prediction.init();
  }

  render() {
    const { list, loadMore, loadingMore, loaded } = this.props.store.prediction;
    if (!loaded) return <Loading />;
    const events = (list || []).map((event, i) => (
      <EventCard key={i} index={i} event={event} />
    ));
    return (
      <Fragment>
        <TopActions />
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
