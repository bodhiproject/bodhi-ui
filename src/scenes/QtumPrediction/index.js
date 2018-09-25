import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import Loading from '../../components/EventListLoading';
import EventCard from './components/EventCard';
import TopActions from './components/TopActions';


@inject('store')
@observer
export default class QtumPrediction extends Component {
  counterInterval = undefined;

  constructor() {
    super();
    this.state = {
      increasingCount: 0,
    };
  }

  componentDidMount() {
    this.props.store.qtumPrediction.init();
    const interval = 1;
    this.counterInterval = setInterval(() => {
      const { increasingCount } = this.state;
      this.setState({
        increasingCount: increasingCount + (interval / 1000000000),
      });
    }, interval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.counterInterval);
  }

  render() {
    const { list, loadMore, loadingMore, loadingFirst } = this.props.store.qtumPrediction;
    if (loadingFirst) return <Loading />;
    const events = (list || []).map((event, i) => (
      <EventCard key={i} index={i} event={event} increasingCount={this.state.increasingCount} />
    )); // eslint-disable-line
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
