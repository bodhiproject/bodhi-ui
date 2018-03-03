import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';

class MyWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <MyBalances />
        <WalletHistory />
      </div>
    );
  }
}

MyWallet.propTypes = {
  classes: PropTypes.object.isRequired,
};

MyWallet.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MyWallet));
