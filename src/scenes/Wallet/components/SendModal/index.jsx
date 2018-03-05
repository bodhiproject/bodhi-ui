import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class SendModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  render() {
    const { classes } = this.props;

    return (
      <Modal
        open={this.state.modalVisible}
        onClose={this.handleClose}
      >
        <div className={classes.paper}>
          <Typography variant="title">
            Send QTUM
          </Typography>
          <Typography variant="subheading">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </div>
      </Modal>
    );
  }

  handleClose() {

  }
}

SendModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SendModal)));
