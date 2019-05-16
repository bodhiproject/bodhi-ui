import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';

import Balances from './Balances';

@inject('store')
@observer
export default class MyWallet extends Component {
  componentWillMount() {
    this.props.store.ui.location = Routes.WALLET;
  }

  render() {
    return (
      <div>
        <Balances />
      </div>
    );
  }
}
