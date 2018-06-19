import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import Loading from '../Loading';

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
    return (
      <Grid container spacing={this.props.spacing}>
        {this.props.data}
        {this.props.loadingMore && <LoadingMore />}
      </Grid>
    );
  }
}

const LoadingMore = () => <Row><Loading text="loadingMore" /></Row>;

const Row = (props) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      margin: 20,
    }}
    {...props}
  />
);
