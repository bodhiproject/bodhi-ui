/* eslint react/no-array-index-key: 0, no-nested-ternary: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Token, OracleStatus, SortBy, EventStatus } from 'constants';

import styles from './styles';
import graphqlActions from '../../redux/Graphql/actions';
import EventCard from '../EventCard';
import EventsEmptyBg from '../EventsEmptyBg';
import InfiniteScroll from '../InfiniteScroll';

const LIMIT = 24;
const SKIP = 0;


@withStyles(styles, { withTheme: true })
@connect((state) => ({
  topics: state.Graphql.get('getTopicsReturn'),
  oracles: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddresses: state.App.get('walletAddresses'),
  txReturn: state.Graphql.get('txReturn'),
}), (dispatch) => ({
  getOracles: (filters, orderBy, limit, skip, exclude) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip, exclude)),
}))
export default class EventCardsGrid extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    topics: PropTypes.array,
    getOracles: PropTypes.func,
    oracles: PropTypes.array,
    eventStatusIndex: PropTypes.number.isRequired,
    sortBy: PropTypes.string,
    syncBlockNum: PropTypes.number,
    walletAddresses: PropTypes.array.isRequired,
    status: PropTypes.string,
    txReturn: PropTypes.object,
  };

  static defaultProps = {
    txReturn: undefined,
    topics: [],
    getOracles: undefined,
    oracles: [],
    sortBy: SortBy.Ascending,
    syncBlockNum: undefined,
    status: '',
  };

  state = {
    skip: 0,
  }

  componentWillMount() {
    const { eventStatusIndex, sortBy, walletAddresses } = this.props;

    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP, walletAddresses);
  }

  componentWillReceiveProps(nextProps) {
    const { eventStatusIndex, sortBy, syncBlockNum, walletAddresses, txReturn } = nextProps;

    if (eventStatusIndex !== this.props.eventStatusIndex
      || sortBy !== this.props.sortBy
      || syncBlockNum !== this.props.syncBlockNum
      || walletAddresses !== this.props.walletAddresses
      || txReturn !== this.props.txReturn) {
      const addresses = walletAddresses || this.props.walletAddresses;
      this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP, addresses);
      this.setState({ skip: 0 });
    }
  }

  loadMoreData = () => {
    let { skip } = this.state;
    const { eventStatusIndex, sortBy, walletAddresses } = this.props;
    skip += LIMIT;
    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, skip, walletAddresses);
    this.setState({ skip });
  }

  executeGraphRequest(eventStatusIndex, sortBy, limit, skip, walletAddresses) {
    const { getOracles } = this.props;

    const sortDirection = sortBy || SortBy.Ascending;
    switch (eventStatusIndex) {
      case EventStatus.Vote: {
        const excludeResultSetterQAddress = walletAddresses.map(({ address }) => address);
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
            { token: Token.Qtum,
              status: OracleStatus.WaitResult,
              excludeResultSetterQAddress },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
  }

  get events() {
    const { eventStatusIndex, topics, oracles } = this.props;
    const { Withdraw } = EventStatus;
    let events = eventStatusIndex === Withdraw ? topics : oracles;
    if (events.length < 1) {
      events = <EventsEmptyBg />;
    } else if (eventStatusIndex === Withdraw) {
      events = events.map((topic, index) => <EventCard key={topic.txid} index={index} {...topic} />);
    } else { // Bet, Set, Vote, Finalize
      events = events.map((oracle, index) => <EventCard key={oracle.txid} index={index} {...oracle} />);
    }
    return events;
  }

  render() {
    return (
      <InfiniteScroll
        spacing={this.props.theme.padding.sm.value}
        data={this.events}
        loadMore={this.loadMoreData}
        hasMore={this.events.length >= this.state.skip + LIMIT}
      />
    );
  }
}
