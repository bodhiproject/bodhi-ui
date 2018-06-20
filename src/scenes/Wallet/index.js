import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import MyBalances from './components/Balances/index';
import ActionButtonHeader from './components/ActionButtonHeader/index';
import WalletHistory from './components/History/index';
import { AppLocation } from '../../constants';

@inject('store')
@observer
export default class MyWallet extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.store.ui.location = AppLocation.wallet;
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
