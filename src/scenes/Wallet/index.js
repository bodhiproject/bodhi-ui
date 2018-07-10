import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';

import MyBalances from './components/Balances';
import ActionButtonHeader from './components/ActionButtonHeader';
import WalletHistory from './components/History';

@inject('store')
@observer
export default class MyWallet extends Component {
  componentWillMount() {
    this.props.store.ui.location = Routes.WALLET;
  }

  render() {
    return (
      <div>
        <ActionButtonHeader />
        <MyBalances />
        <WalletHistory />
      </div>
    );
  }
}
