import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Grid, Typography } from '@material-ui/core';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';

@inject('store')
@observer
export default class Search extends Component {
  render() {
    const { list, loading } = this.props.store.search;
    const events = (list || []).map((event, i) => (<EventCard key={i} index={i} event={event} />));
    const noResult = (
      <Typography variant="body1">
        <FormattedMessage id="search.emptySearchResult" defaultMessage="Oops, your search has no results." />
      </Typography>
    );
    return (
      <Fragment>
        <Grid container spacing={theme.padding.sm.value}>
          {list.length === 0 && !loading ? noResult : events}
        </Grid>
      </Fragment>
    );
  }
}
