import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import appActions from '../redux/app/actions';

class GlobalHub extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    const {
      listUnspent,
      getBotBalance,
      walletAddrs,
    } = this.props;

    listUnspent();
    if (!_.isEmpty(walletAddrs)) {
      _.each(walletAddrs, (address) => {
        getBotBalance(address.address, address.address);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      walletAddrs,
      syncBlockNum,
      listUnspent,
      getBotBalance,
    } = this.props;

    // Update page on new block
    if (nextProps.syncBlockNum !== syncBlockNum) {
      listUnspent();

      if (nextProps.walletAddrs) {
        _.each(nextProps.walletAddrs, (address) => {
          getBotBalance(address.address, address.address);
        });
      }
    }
  }

  render() {
    return null;
  }
}

GlobalHub.propTypes = {
  syncBlockNum: PropTypes.number,
  walletAddrs: PropTypes.array,
  listUnspent: PropTypes.func,
  getBotBalance: PropTypes.func,
};

GlobalHub.defaultProps = {
  syncBlockNum: undefined,
  walletAddrs: [],
  listUnspent: undefined,
  getBotBalance: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddrs: state.App.get('walletAddrs'),
});

function mapDispatchToProps(dispatch) {
  return {
    listUnspent: () => dispatch(appActions.listUnspent()),
    getBotBalance: (owner, senderAddress) => dispatch(appActions.getBotBalance(owner, senderAddress)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalHub);
