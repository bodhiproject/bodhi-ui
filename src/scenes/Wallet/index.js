import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';

import ActionButtonHeader from './ActionButtonHeader';
import Balances from './Balances';
import History from './History';

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
        <Balances />
        <History />
      </div>
    );
  }
}
