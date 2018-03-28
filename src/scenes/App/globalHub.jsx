import React, { PureComponent } from 'react';
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
  static propTypes = {
    client: PropTypes.object,
    getSyncInfo: PropTypes.func.isRequired,
    onSyncInfo: PropTypes.func.isRequired,
    syncPercent: PropTypes.number.isRequired,
    syncBlockNum: PropTypes.number.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    checkWalletEncrypted: PropTypes.func.isRequired,
    getActionableItemCount: PropTypes.func.isRequired,
    txReturn: PropTypes.object,
    getPendingTransactions: PropTypes.func.isRequired,
    togglePendingTxsSnackbar: PropTypes.func.isRequired,
  };

  static defaultProps = {
    client: undefined,
    txReturn: undefined,
  };

  componentWillMount() {
    const {
      checkWalletEncrypted,
      getSyncInfo,
      syncPercent,
      getPendingTransactions,
    } = this.props;

    // Checks to see if any txs will require unlocking the wallet
    checkWalletEncrypted();

    // Start syncInfo long polling
    // We use this to update the percentage of the loading screen
    getSyncInfo(syncPercent);
    syncInfoInterval = setInterval(this.fetchSyncInfo, AppConfig.intervals.syncInfo);

    // Subscribe to syncInfo subscription
    // This returns only after the initial sync is done, and every new block that is returned
    this.subscribeSyncInfo();

    // Get all pending txs to show snackbar
    getPendingTransactions();
  }

  componentWillReceiveProps(nextProps) {
    const {
      syncPercent,
      syncBlockNum,
      getActionableItemCount,
      walletAddresses,
      txReturn,
      togglePendingTxsSnackbar,
      getPendingTransactions,
    } = this.props;

    // Disable the syncInfo polling since we will get new syncInfo from the subscription
    if (syncPercent >= 100) {
      clearInterval(syncInfoInterval);
    }

    // Gets the actionable items for the My Activities badge
    if ((syncPercent === 100 && syncBlockNum !== nextProps.syncBlockNum)
      || (_.isEmpty(walletAddresses) && !_.isEmpty(nextProps.walletAddresses))) {
      getActionableItemCount(nextProps.walletAddresses ? nextProps.walletAddresses : walletAddresses);
    }

    // Tx was executed, show the pending txs snackbar again
    if (!txReturn && nextProps.txReturn) {
      togglePendingTxsSnackbar(true);
    }

    // Refresh the pending txs snackbar when a tx is created or on a new block
    if ((!txReturn && nextProps.txReturn)
      || (syncPercent === 100 && syncBlockNum !== nextProps.syncBlockNum)) {
      getPendingTransactions();
    }
  }

  render() {
    return null;
  }

  fetchSyncInfo = () => {
    const { getSyncInfo, syncPercent } = this.props;
    getSyncInfo(syncPercent);
  };

  subscribeSyncInfo = () => {
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
  };
}

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  txReturn: state.Graphql.get('txReturn'),
});

const mapDispatchToProps = (dispatch) => ({
  checkWalletEncrypted: () => dispatch(appActions.checkWalletEncrypted()),
  getSyncInfo: (syncPercent) => dispatch(appActions.getSyncInfo(syncPercent)),
  onSyncInfo: (syncInfo) => dispatch(appActions.onSyncInfo(syncInfo)),
  togglePendingTxsSnackbar: (isVisible) => dispatch(appActions.togglePendingTxsSnackbar(isVisible)),
  getActionableItemCount: (walletAddresses) => dispatch(graphqlActions.getActionableItemCount(walletAddresses)),
  getPendingTransactions: () => dispatch(graphqlActions.getPendingTransactions()),
});

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps),
)(GlobalHub);
