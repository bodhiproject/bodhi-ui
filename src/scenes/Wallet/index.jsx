import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';

class MyWallet extends React.Component {
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);
