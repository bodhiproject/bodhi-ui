import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import TopActions from '../../components/TopActions';
import _Loading from '../../components/Loading';
import styles from './styles';


const messages = defineMessages({
  loadAllEventsMsg: {
    id: 'load.allEvents',
    defaultMessage: 'loading',
  },
});

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
        <TopActions noCreateEventButton />
        <Events allEvents={allEvents} />
      </Fragment>
    );
  }
}

const Events = observer(({ allEvents: { list, loadMoreEvents, loading, loadingMore } }) => {
  if (loading) return <Loading />;
  const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
  return (
    <InfiniteScroll
      spacing={theme.padding.sm.value}
      data={events}
      loadMore={loadMoreEvents}
      loadingMore={loadingMore}
    />
  );
});

const Loading = withStyles(styles)(({ classes }) => <Row><_Loading className={classes.loading} text={messages.loadAllEventsMsg} /></Row>);

const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));
