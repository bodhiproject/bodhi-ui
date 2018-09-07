import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';

@inject('store')
@observer
export default class Search extends Component {
  componentDidMount() {
    this.props.store.search.init('卧槽');
  }

  render() {
    const { list } = this.props.store.search;
    const events = (list || []).map((event, i) => (<EventCard key={i} index={i} event={event} />));
    return (
      <Fragment>
        <Grid container spacing={theme.padding.sm.value}>
          {events}
        </Grid>
      </Fragment>
    );
  }
}
