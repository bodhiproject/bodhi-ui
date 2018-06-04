/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../redux/App/actions';
import graphqlActions from '../../redux/Graphql/actions';
import InfiniteScroll from '../../components/InfiniteScroll';
import theme from '../../config/theme';

const LIMIT = 25;


@connect((state) => (console.log('TOPICS: ', state.Graphql.get('getTopicsReturn')), {
  events: [..._.get(state.Graphql.get('getTopicsReturn'), 'data', []), ..._.get(state.Graphql.get('getOraclesReturn'), 'data', [])],
  sortBy: state.Dashboard.get('sortBy') || 'ASC',
  walletAddresses: state.App.get('walletAddresses'),
}), (dispatch) => ({
  getAllEvents: (...args) => {
    dispatch(graphqlActions.getOracles(null, ...args));
    dispatch(graphqlActions.getTopics(null, ...args));
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
    this.props.getAllEvents();
  }

  componentWillMount() {
    this.props.setAppLocation('allEvents');
  }

  loadMoreData = () => {
    let { skip } = this.state;
    const { sortBy, walletAddresses } = this.props;
    skip += LIMIT;
    const orderBy = { field: 'endTime', direction: sortBy };
    this.props.getAllEvents(orderBy, LIMIT, skip, walletAddresses);
    this.setState({ skip });
  }

  render() {
    console.log('EVENTS: ', this.props.events);
    return (
      <InfiniteScroll
        spacing={theme.padding.sm.value}
        data={this.props.events}
        loadMore={this.loadMoreData}
        hasMore={this.props.events.length >= this.state.skip + LIMIT}
      />
    );
  }
}
