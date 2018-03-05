import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class DepositDialog extends React.Component {
  render() {
    const {
      classes,
      dialogVisible,
      walletAddress,
      onClose,
    } = this.props;

    return (
      <Dialog
        open={dialogVisible}
        onClose={onClose}
      >
        <DialogTitle>
          <FormattedMessage id="depositDialog.title" default="QTUM/BOT Deposit Address" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{walletAddress}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            <FormattedMessage id="str.close" default="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClose() {
  }
}

DepositDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

DepositDialog.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DepositDialog)));
