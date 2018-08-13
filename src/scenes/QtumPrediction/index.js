import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
<<<<<<< HEAD
import Loading from '../../components/EventListLoading';
import EventCard from './components/EventCard';
import TopActions from './components/TopActions';
=======
import EventCard from '../../components/EventCard';
import Loading from '../../components/EventListLoading';
import TopActions from './TopActions';
>>>>>>> move TopActions

@inject('store')
@observer
export default class QtumPrediction extends Component {
  counterInterval = undefined;

  constructor() {
    super();
    this.state = {
      secondlyHeartBeat: 0,
    };
  }

  componentDidMount() {
    this.props.store.qtumPrediction.init();
    const interval = 1;
    this.counterInterval = setInterval(() => {
      const { secondlyHeartBeat } = this.state;
      this.setState({
        secondlyHeartBeat: secondlyHeartBeat + interval,
      });
    }, interval * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.counterInterval);
  }

  render() {
    const { list, loadMore, loadingMore, loading } = this.props.store.qtumPrediction;
    if (loading) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} secondlyHeartBeat={this.state.secondlyHeartBeat} />); // eslint-disable-line
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
