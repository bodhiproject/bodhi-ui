import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../redux/App/actions';


@connect((state) => ({
  events: [...(state.Graphql.get('getTopicsReturn') || []), ...(state.Graphql.get('getOraclesReturn') || [])],
}), (dispatch) => ({
  getAllEvents: () => {

  },
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
}))
export default class AllEvents extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    getAllEvents: PropTypes.func.isRequired,
    setAppLocation: PropTypes.func.isRequired,
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
    const { eventStatusIndex, sortBy, walletAddresses } = this.props;
    skip += LIMIT;
    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, skip, walletAddresses);
    this.setState({ skip });
  }

  render() {
    return (
      <InfiniteScroll
        spacing={theme.padding.sm.value}
        data={rowItems}
        loadMore={this.loadMoreData}
        hasMore={rowItems.length >= this.state.skip + LIMIT}
      />
    );
  }
}