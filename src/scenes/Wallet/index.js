import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';

import MyBalances from './components/Balances';
import ActionButtonHeader from './components/ActionButtonHeader';
import WalletHistory from './components/History';
import TxSentDialog from '../../components/TxSentDialog';

@inject('store')
@observer
export default class MyWallet extends Component {
  componentWillMount() {
    this.props.store.ui.location = Routes.WALLET;
  }

  render() {
    const { store: { wallet } } = this.props;

    return (
      <div>
        <ActionButtonHeader />
        <MyBalances />
        <WalletHistory />
        <TxSentDialog
          txid={wallet.lastTransaction && wallet.lastTransaction.txid}
          open={wallet.txSentDialogOpen}
          onClose={() => wallet.txSentDialogOpen = false}
        />
      </div>
    );
  }
}
