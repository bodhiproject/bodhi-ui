import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withApollo } from 'react-apollo';
import _ from 'lodash';

import appActions from '../redux/app/actions';
import getSubscription, { channels } from '../network/graphSubscription';

class GlobalHub extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.subscribeSyncInfo = this.subscribeSyncInfo.bind(this);
  }

  componentWillMount() {
    const {
      getSyncInfo,
      listUnspent,
      getBotBalance,
      walletAddrs,
    } = this.props;

    getSyncInfo();
    this.subscribeSyncInfo();

    listUnspent();
    if (!_.isEmpty(walletAddrs)) {
      _.each(walletAddrs, (address) => {
        getBotBalance(address.address, address.address);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      walletAddrs,
      syncBlockNum,
      listUnspent,
      getBotBalance,
    } = this.props;

    // Update page on new block
    if (nextProps.syncBlockNum !== syncBlockNum) {
      listUnspent();

      if (nextProps.walletAddrs) {
        _.each(nextProps.walletAddrs, (address) => {
          getBotBalance(address.address, address.address);
        });
      }
    }
  }

  render() {
    return null;
  }

  subscribeSyncInfo() {
    const { client, onSyncInfo } = this.props;

    console.log('Subscribe: onSyncInfo');
    client.subscribe({
      query: getSubscription(channels.ON_SYNC_INFO),
    }).subscribe({
      next(data) {
        console.log(data.data.onSyncInfo);
        onSyncInfo(data.data.onSyncInfo);
      },
      error(err) {
        onSyncInfo({ error: err.message });
      },
    });
  }
}

GlobalHub.propTypes = {
  client: PropTypes.object,
  syncBlockNum: PropTypes.number,
  walletAddrs: PropTypes.array,
  getSyncInfo: PropTypes.func,
  onSyncInfo: PropTypes.func,
  listUnspent: PropTypes.func,
  getBotBalance: PropTypes.func,
};

GlobalHub.defaultProps = {
  client: undefined,
  syncBlockNum: undefined,
  walletAddrs: [],
  getSyncInfo: undefined,
  onSyncInfo: undefined,
  listUnspent: undefined,
  getBotBalance: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddrs: state.App.get('walletAddrs'),
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
  onSyncInfo: (syncInfo) => dispatch(appActions.onSyncInfo(syncInfo)),
  listUnspent: () => dispatch(appActions.listUnspent()),
  getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
});

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalHub);
