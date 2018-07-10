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
<<<<<<< HEAD
    this.props.store.ui.location = Routes.WALLET;
=======
    this.props.store.ui.location = AppLocation.WALLET;
>>>>>>> change all, all testing passed
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
