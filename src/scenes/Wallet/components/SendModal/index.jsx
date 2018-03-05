import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';

import MyBalances from './components/Balances/index';
import WalletHistory from './components/History/index';

class SendModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  render() {
    return (
      <Modal
        open={this.state.open}
        onClose={this.handleClose}
      >
        <div className={classes.paper}>
          <Typography variant="title">
            Send QTUM
          </Typography>
          <Typography variant="subheading">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <SimpleModalWrapped />
        </div>
      </Modal>
    );
  }

  handleClose() {

  }
}

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendModal);
