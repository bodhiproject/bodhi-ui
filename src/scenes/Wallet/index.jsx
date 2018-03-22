import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';
import appActions from '../../redux/App/actions';
import { AppLocation } from '../../constants';

class MyWallet extends React.Component {
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
        <MyBalances />
        <WalletHistory />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
    setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);
