import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Grid, Typography, withWidth, Button, withStyles } from '@material-ui/core';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Routes } from 'constants';
import { Loading } from '../Loading';
import styles from './styles';

const messages = defineMessages({
  loadMoreMsg: {
    id: 'load.more',
    defaultMessage: 'loading more',
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
    const { data, spacing, loadingMore, store, width } = this.props;
    const { createEvent, ui } = store;
    return data.length > 0 ? (
      <Grid container spacing={spacing}>
        {data}
        {loadingMore && <LoadingMore />}
      </Grid>
    ) : (
      <Row>
        <Row><img src="/images/empty.svg" alt="empty placeholder" /></Row>
        <Row>
          <Typography variant="title">
            <FormattedMessage id="events.empty" defaultMessage="There's no ongoing events currently." />
          </Typography>
        </Row>
        {ui.location === Routes.QTUM_PREDICTION &&
        <Row>
          <Button
            size={width === 'xs' ? 'small' : 'medium'}
            color="primary"
            onClick={createEvent.open}
          >
            <FormattedMessage id="create.dialogTitle" defaultMessage="CREATE AN EVENT" />
          </Button>
        </Row>
        }
      </Row>
    );
  }
}

const LoadingMore = () => <Row><Loading text={messages.loadMoreMsg} /></Row>;

export const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));
