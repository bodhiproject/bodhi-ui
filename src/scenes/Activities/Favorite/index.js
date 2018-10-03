import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import theme from '../../../config/theme';
import EventCard from '../../../components/EventCard';
import Loading from '../../../components/EventListLoading';
import { Row } from '../../../components/InfiniteScroll';

@inject('store')
@observer
export default class Favorite extends Component {
  componentDidMount() {
    this.props.store.favorite.init();
  }

  render() {
    const { displayList, loading } = this.props.store.favorite;
    if (loading) return <Loading />;
    const events = (displayList || []).map((event, i) => <EventCard key={i} index={i} event={event} />); // eslint-disable-line
    return (
      <Fragment>
        {displayList.length ? (
          <Grid container spacing={theme.padding.sm.value}>
            {events}
          </Grid>
        ) : (
          <Row>
            <Row><img src="/images/empty.svg" alt="empty placeholder" /></Row>
            <Row>
              <Typography variant="title">
                <FormattedMessage id="str.emptyFavorite" defaultMessage="You do not have any favorite events right now." />
              </Typography>
            </Row>
          </Row>
        )}
      </Fragment>
    );
  }
}
