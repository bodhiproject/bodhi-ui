import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Grid, withWidth, withStyles } from '@material-ui/core';
import { defineMessages } from 'react-intl';
import { Loading } from '../Loading';
import styles from './styles';
import EmptyPlaceholder from '../EmptyPlaceholder';

const messages = defineMessages({
  loadMoreMsg: {
    id: 'load.more',
    defaultMessage: 'loading more',
  },
  eventsEmptyMsg: {
    id: 'events.empty',
    defaultMessage: 'There is no ongoing events',
  },
});

@withWidth()
@inject('store')
@observer
export default class InfiniteScroll extends Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    loadingMore: PropTypes.bool,
    loadMore: PropTypes.func,
    spacing: PropTypes.number,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    hasMore: true,
    loadMore: undefined,
    loadingMore: false,
    spacing: undefined,
    data: undefined,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom && this.props.hasMore) {
      this.props.loadMore();
    }
  }

  render() {
    const { data, spacing, loadingMore } = this.props;
    return data.length > 0 ? (
      <Grid container spacing={spacing}>
        {data}
        {loadingMore && <LoadingMore />}
      </Grid>
    ) : (
      <EmptyPlaceholder message={messages.eventsEmptyMsg} />
    );
  }
}

const LoadingMore = () => <Row><Loading text={messages.loadMoreMsg} /></Row>;

export const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));
