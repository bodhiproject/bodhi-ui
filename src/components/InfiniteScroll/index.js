import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

export default class InfiniteScroll extends Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    spacing: PropTypes.number,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    hasMore: false,
    loadMore: undefined,
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
      </Grid>
    );
  }
}
