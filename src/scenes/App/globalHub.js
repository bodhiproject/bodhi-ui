import { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import _ from 'lodash';
import { injectIntl } from 'react-intl';

import appActions from '../../redux/App/actions';
import graphqlActions from '../../redux/Graphql/actions';
import getSubscription, { channels } from '../../network/graphSubscription';
import AppConfig from '../../config/app';

let syncInfoInterval;


@injectIntl
@withApollo
@connect((state) => ({
  ...state.App.toJS(),
  txReturn: state.Graphql.get('txReturn'),
}), (dispatch) => ({
  onSyncInfo: (syncInfo) => dispatch(appActions.onSyncInfo(syncInfo)),
  togglePendingTxsSnackbar: (isVisible) => dispatch(appActions.togglePendingTxsSnackbar(isVisible)),
  getActionableItemCount: (walletAddresses) => dispatch(graphqlActions.getActionableItemCount(walletAddresses)),
  getPendingTransactions: () => dispatch(graphqlActions.getPendingTransactions()),
}))
@inject('store')
@observer
export default class GlobalHub extends Component {
  static propTypes = {
    client: PropTypes.object,
    onSyncInfo: PropTypes.func.isRequired,
    syncBlockNum: PropTypes.number.isRequired,
    walletAddresses: PropTypes.array.isRequired,
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
    const { getPendingTransactions } = this.props;
    const { getSyncInfo } = this.props.store.global;
    const { checkWalletEncrypted } = this.props.store.wallet;

    // Checks to see if any txs will require unlocking the wallet
    checkWalletEncrypted();

    // Start syncInfo long polling
    // We use this to update the percentage of the loading screen
    getSyncInfo();
    syncInfoInterval = setInterval(this.fetchSyncInfo, AppConfig.intervals.syncInfo);

    // Subscribe to syncInfo subscription
    // This returns only after the initial sync is done, and every new block that is returned
    this.subscribeSyncInfo();

    // Get all pending txs to show snackbar
    getPendingTransactions();
  }

  componentWillReceiveProps(nextProps) {
    const {
      syncBlockNum,
      getActionableItemCount,
      walletAddresses,
      txReturn,
      togglePendingTxsSnackbar,
      getPendingTransactions,
    } = this.props;
    const { syncPercent } = this.props.store.global;

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
    this.props.store.global.getSyncInfo();
  };

  subscribeSyncInfo = () => {
    const { client, onSyncInfo, store } = this.props;

    client.subscribe({
      query: getSubscription(channels.ON_SYNC_INFO),
    }).subscribe({
      next({ data }) {
        store.global.onSyncInfo(data.onSyncInfo);
        onSyncInfo(data.onSyncInfo);
      },
      error(err) {
        store.global.onSyncInfo({ error: err.message });
        onSyncInfo({ error: err.message });
      },
    });
  };
}
