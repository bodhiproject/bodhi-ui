import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';

class MyWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    const { walletAddrs } = this.props;
    console.log('addrs', walletAddrs);
    console.log('next addrs', nextProps.walletAddrs);
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

MyWallet.propTypes = {
  walletAddrs: PropTypes.array,
};

MyWallet.defaultProps = {
  walletAddrs: [],
};

const mapStateToProps = (state) => ({
  walletAddrs: state.App.get('walletAddrs'),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);
