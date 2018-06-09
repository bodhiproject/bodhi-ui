/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../redux/App/actions';
import graphqlActions from '../../redux/Graphql/actions';
import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import { Token, OracleStatus } from '../../constants';
import TopActions from '../Dashboard/components/TopActions';
import { AppLocation } from '../../constants';

const LIMIT = 50;


@connect((state) => ({
  events: state.Graphql.get('allEvents'),
  sortBy: state.Dashboard.get('sortBy') || 'ASC',
  walletAddresses: state.App.get('walletAddresses'),
}), (dispatch) => ({
  getAllEvents: (...args) => dispatch(graphqlActions.getAllEvents(...args)),
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
}))
export default class AllEvents extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    getAllEvents: PropTypes.func.isRequired,
    setAppLocation: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
  }

  state = {
    skip: 0,
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sortBy !== this.props.sortBy) {
      this.fetchEvents(0, this.state.skip)
    }
  }

  componentDidMount() {
    this.loadMoreData();
    this.props.setAppLocation(AppLocation.allEvents);
  }

  loadMoreData = () => {
    let { skip } = this.state;
    skip += LIMIT;
    this.fetchEvents(skip)
    this.setState({ skip });
  }

  fetchEvents(skip, limit = LIMIT) {
    const { sortBy, walletAddresses, getAllEvents } = this.props;
    const orderBy = { field: 'blockNum', direction: sortBy };
    const filters = [
      // finalizing
      { token: Token.Bot, status: OracleStatus.WaitResult },
      // voting
      { token: Token.Bot, status: OracleStatus.Voting },
      // { token: Token.Qtum,
      //   status: OracleStatus.WaitResult,
      //   excludeSelfAddress: walletAddresses.map(({ address }) => address) },
      // betting
      { token: Token.Qtum, status: OracleStatus.Voting },
      { token: Token.Qtum, status: OracleStatus.Created },
      // result setting
      { token: Token.Qtum, status: OracleStatus.OpenResultSet },
      { token: Token.Qtum, status: OracleStatus.WaitResult }
    ]
    getAllEvents(filters, orderBy, limit, skip, walletAddresses);
  }

  render() {
    const events = this.props.events.map((event, i) => <EventCard key={i} index={i} {...event} />)
    return (
      <div>
        <TopActions noCreateEventButton />
        <InfiniteScroll
          spacing={theme.padding.sm.value}
          data={events}
          loadMore={this.loadMoreData}
          hasMore={this.props.events.length >= this.state.skip + LIMIT}
        />
      </div>
    );
  }
}
