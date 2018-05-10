import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';

import MyBalances from './components/Balances/index';
import FunctionRow from './components/FunctionRow/index';
import WalletHistory from './components/History/index';
import appActions from '../../redux/App/actions';
import { AppLocation } from '../../constants';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect(null, (dispatch) => ({
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
}))
export default class MyWallet extends Component {
  static propTypes = {
    setAppLocation: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { setAppLocation } = this.props;

    setAppLocation(AppLocation.wallet);
  }

  render() {
    return (
      <div>
        <FunctionRow />
        <MyBalances />
        <WalletHistory />
      </div>
    );
  }
}
