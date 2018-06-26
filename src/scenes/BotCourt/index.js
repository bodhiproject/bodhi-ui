import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import TopActions from '../Dashboard/components/TopActions';
import _Loading from '../../components/Loading';
import EventsEmptyBg from '../../components/EventsEmptyBg';
import styles from './styles';


@inject('store')
@observer
export default class BotCourt extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.store.botCourt.init();
  }

  render() {
    const { list, loadMore, loadingMore, loading } = this.props.store.botCourt;
    if (loading) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} {...event} />); // eslint-disable-line
    return (
      <Fragment>
        <TopActions />
        {(events.length < 1) && <EventsEmptyBg />}
        {(events.length > 1) && <InfiniteScroll
          spacing={theme.padding.sm.value}
          data={events}
          loadMore={loadMore}
          loadingMore={loadingMore}
        />}
      </Fragment>
    );
  }
}

const Loading = withStyles(styles)(({ classes }) => <Row><_Loading className={classes.loading} text="loading" /></Row>);

const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));
