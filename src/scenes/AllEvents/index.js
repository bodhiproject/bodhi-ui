import React, { Component } from 'react';
import { connect } from 'react-redux';


@connect((state) => ({

}), (dispatch) => ({

}))
export default class AllEvents extends Component {

  state = {
    skip: 0,
  }

  componentWillMount = () => {
    this.setAppLocation('allEvents');
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