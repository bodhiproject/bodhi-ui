import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { NoWalletPrompt } from 'components';
import InfiniteScroll from '../../../components/InfiniteScroll';
import EventCard from '../../../components/EventCard';
import Loading from '../../../components/EventListLoading';


@inject('store')
@observer
export default class ResultSetting extends Component {
  componentDidMount() {
    this.props.store.activities.resultSetting.init();
  }

  render() {
    const { account } = this.props.store.naka;
    const { list, loadMore, loadingMore, loaded } = this.props.store.activities.resultSetting;
    if (!loaded) return <Loading />;
    const events = (list || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        {account ? (
          <InfiniteScroll
            spacing={2}
            data={events}
            loadMore={loadMore}
            loadingMore={loadingMore}
          />
        ) : (
          <NoWalletPrompt inline />
        )}
      </Fragment>
    );
  }
}
