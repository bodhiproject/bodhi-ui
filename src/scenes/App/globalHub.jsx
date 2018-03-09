import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withApollo } from 'react-apollo';
import _ from 'lodash';

import appActions from '../../redux/App/actions';
import graphqlActions from '../../redux/Graphql/actions';
import getSubscription, { channels } from '../../network/graphSubscription';
import AppConfig from '../../config/app';

let syncInfoInterval;

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
    const { walletAddresses } = this.props;

    // Start syncInfo long polling
    // We use this to update the percentage of the loading screen
    this.pollSyncInfo();

    // Subscribe to syncInfo subscription
    // This returns only after the initial sync is done, and every new block that is returned
    this.subscribeSyncInfo();

    // Get unspent outputs and bot balances for all the wallet addresses
    this.updateBalances(walletAddresses);
  }

  componentWillReceiveProps(nextProps) {
    const {
      initSyncing,
      syncBlockNum,
      getActionableItemCount,
      selectedWalletAddress,
    } = this.props;

    // Disable the syncInfo polling since we will get new syncInfo from the subscription
    if (initSyncing && !nextProps.initSyncing) {
      clearInterval(syncInfoInterval);
    }

    // Update balances after init sync and on new block
    if ((!nextProps.initSyncing && nextProps.syncBlockNum !== syncBlockNum)
      || (initSyncing && !nextProps.initSyncing)) {
      this.updateBalances(nextProps.walletAddresses);

      // Gets the actionable items for the My Activities badge
      if (nextProps.selectedWalletAddress !== selectedWalletAddress) {
        getActionableItemCount(nextProps.selectedWalletAddress);
      }
    }
  }

  render() {
    return null;
  }

  subscribeSyncInfo() {
    const { client, onSyncInfo } = this.props;

    client.subscribe({
      query: getSubscription(channels.ON_SYNC_INFO),
    }).subscribe({
      next(data) {
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
    syncInfoInterval = setInterval(getSyncInfo, AppConfig.intervals.syncInfo);
  }

  updateBalances(walletAddresses) {
    const {
      initSyncing,
      listUnspent,
      getBotBalance,
    } = this.props;

    listUnspent();

    if (!_.isEmpty(walletAddresses)) {
      _.each(walletAddresses, (item) => {
        getBotBalance(item.address, item.address);
      });
    }
  }
}

GlobalHub.propTypes = {
  client: PropTypes.object,
  initSyncing: PropTypes.bool.isRequired,
  syncBlockNum: PropTypes.number,
  walletAddresses: PropTypes.array,
  selectedWalletAddress: PropTypes.string.isRequired,
  getSyncInfo: PropTypes.func,
  onSyncInfo: PropTypes.func,
  listUnspent: PropTypes.func,
  getBotBalance: PropTypes.func,
  getActionableItemCount: PropTypes.func,
};

GlobalHub.defaultProps = {
  client: undefined,
  syncBlockNum: undefined,
  walletAddresses: [],
  getSyncInfo: undefined,
  onSyncInfo: undefined,
  listUnspent: undefined,
  getBotBalance: undefined,
  getActionableItemCount: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  initSyncing: state.App.get('initSyncing'),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddresses: state.App.get('walletAddresses'),
  selectedWalletAddress: state.App.get('selectedWalletAddress'),
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
  onSyncInfo: (syncInfo) => dispatch(appActions.onSyncInfo(syncInfo)),
  listUnspent: () => dispatch(appActions.listUnspent()),
  getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
  getActionableItemCount: (walletAddress) => dispatch(graphqlActions.getActionableItemCount(walletAddress)),
});

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalHub);
