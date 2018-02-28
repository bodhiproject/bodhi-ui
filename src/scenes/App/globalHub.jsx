import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withApollo } from 'react-apollo';
import _ from 'lodash';

import appActions from '../../redux/app/actions';
import getSubscription, { channels } from '../../network/graphSubscription';
import AppConfig from '../../config/app';

class GlobalHub extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.subscribeSyncInfo = this.subscribeSyncInfo.bind(this);
    this.pollSyncInfo = this.pollSyncInfo.bind(this);
    this.updateBalances = this.updateBalances.bind(this);
  }

  componentWillMount() {
    const { walletAddrs } = this.props;

    // Subscribe to syncInfo subscription
    // This returns only after the initial sync is done, and every new block that is returned
    this.subscribeSyncInfo();

    // Start syncInfo long polling
    // We use this to update the percentage of the loading screen
    this.pollSyncInfo();

    // Get unspent outputs and bot balances for all the wallet addresses
    this.updateBalances(walletAddrs);
  }

  componentWillReceiveProps(nextProps) {
    const { syncBlockNum } = this.props;

    // Update on new block
    if (nextProps.syncBlockNum !== syncBlockNum) {
      this.updateBalances(nextProps.walletAddrs);
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
        console.debug('onSyncInfo', data.data.onSyncInfo);
        onSyncInfo(data.data.onSyncInfo);
      },
      error(err) {
        onSyncInfo({ error: err.message });
      },
    });
  }

  pollSyncInfo() {
    const { getSyncInfo } = this.props;

    getSyncInfo();
    setTimeout(this.pollSyncInfo, AppConfig.intervals.syncInfo);
  }

  updateBalances(walletAddresses) {
    const { listUnspent, getBotBalance } = this.props;

    listUnspent();

    if (!_.isEmpty(walletAddresses)) {
      _.each(walletAddresses, (address) => {
        getBotBalance(address.address, address.address);
      });
    }
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
