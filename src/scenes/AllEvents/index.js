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

const LIMIT = 5;


@connect((state) => (console.log('TOPICS: ', state.Graphql.get('getTopicsReturn'), 'ORACLES: ', state.Graphql.get('getOraclesReturn')), {
  events: [...state.Graphql.get('getOraclesReturn'), ...state.Graphql.get('getTopicsReturn')],
  sortBy: state.Dashboard.get('sortBy') || 'ASC',
  walletAddresses: state.App.get('walletAddresses'),
}), (dispatch) => ({
  getAllEvents: (...args) => {
    console.log('ARGS: ', args);
    dispatch(graphqlActions.getOracles(...args));
    console.log('TOPIC ARGS: ', topicArgs);
    const [filters, ...topicArgs] = args;
    dispatch(graphqlActions.getTopics(...topicArgs));
    // const [filters, orderBy, limit, skip, walletAddresses] = args;
    // dispatch(graphqlActions.getActionableTopics(walletAddresses, orderBy, limit, skip));
  },
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

  componentDidMount() {
    this.loadMoreData();
    // const { sortBy, walletAddresses } = this.props;
    // const orderBy = { field: 'endTime', direction: sortBy };
    // this.props.getAllEvents(orderBy, LIMIT, 0, walletAddresses);
  }

  componentWillMount() {
    this.props.setAppLocation('allEvents');
  }

  loadMoreData = () => {
    let { skip } = this.state;
    const { sortBy, walletAddresses } = this.props;
    skip += LIMIT;
    const orderBy = { field: 'endTime', direction: sortBy };
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
    this.props.getAllEvents(filters, orderBy, LIMIT, skip, walletAddresses);
    this.setState({ skip });
  }

  render() {
    const events = this.props.events.map((event, i) => <EventCard key={i} index={i} {...event} />)
    console.log('EVENTS: ', this.props.events);
    return (
      <InfiniteScroll
        spacing={theme.padding.sm.value}
        data={events}
        loadMore={this.loadMoreData}
        hasMore={this.props.events.length >= this.state.skip + LIMIT}
      />
    );
  }
}
