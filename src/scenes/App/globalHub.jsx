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
    this.updateQtumBalances = this.updateQtumBalances.bind(this);
    this.updateBotBalances = this.updateBotBalances.bind(this);
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
    this.updateQtumBalances(walletAddresses);
  }

  componentWillReceiveProps(nextProps) {
    const {
      initSyncing,
      syncBlockNum,
      getActionableItemCount,
      walletAddresses,
      lastUsedAddress,
      disableUpdatingBalances,
    } = this.props;

    // Disable the syncInfo polling since we will get new syncInfo from the subscription
    if (initSyncing && !nextProps.initSyncing) {
      clearInterval(syncInfoInterval);
    }

    // Update balances after init sync and on new block
    if ((!nextProps.initSyncing && nextProps.syncBlockNum !== syncBlockNum)
      || (initSyncing && !nextProps.initSyncing)) {
      this.updateQtumBalances(nextProps.walletAddresses);
    }

    if (nextProps.updatingBalances) {
      this.updateBotBalances(nextProps.walletAddresses);
      disableUpdatingBalances();
    }

    // Gets the actionable items for the My Activities badge
    if (nextProps.lastUsedAddress !== lastUsedAddress) {
      getActionableItemCount(nextProps.lastUsedAddress);
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

  updateQtumBalances(walletAddresses) {
    const {
      initSyncing,
      listUnspent,
      getBotBalance,
    } = this.props;

    listUnspent();
  }

  updateBotBalances(nextWalletAddresses) {
    const { walletAddresses, getBotBalance } = this.props;

    _.each(walletAddresses, (item) => {
      getBotBalance(item.address, item.address);
    });
  }
}

GlobalHub.propTypes = {
  client: PropTypes.object,
  initSyncing: PropTypes.bool.isRequired,
  syncBlockNum: PropTypes.number,
  walletAddresses: PropTypes.array,
  lastUsedAddress: PropTypes.string.isRequired,
  updatingBalances: PropTypes.bool.isRequired,
  disableUpdatingBalances: PropTypes.func.isRequired,
  getSyncInfo: PropTypes.func,
  onSyncInfo: PropTypes.func,
  listUnspent: PropTypes.func,
  getBotBalance: PropTypes.func,
  getActionableItemCount: PropTypes.func.isRequired,
};

GlobalHub.defaultProps = {
  client: undefined,
  syncBlockNum: undefined,
  walletAddresses: [],
  getSyncInfo: undefined,
  onSyncInfo: undefined,
  listUnspent: undefined,
  getBotBalance: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  initSyncing: state.App.get('initSyncing'),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  updatingBalances: state.App.get('updatingBalances'),
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
  onSyncInfo: (syncInfo) => dispatch(appActions.onSyncInfo(syncInfo)),
  listUnspent: () => dispatch(appActions.listUnspent()),
  getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
  disableUpdatingBalances: () => dispatch(appActions.disableUpdatingBalances()),
  getActionableItemCount: (walletAddress) => dispatch(graphqlActions.getActionableItemCount(walletAddress)),
});

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalHub);
