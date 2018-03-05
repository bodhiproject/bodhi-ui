import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class DepositDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogVisible: true,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.state.dialogVisible}
        onClose={this.handleClose}
      >
        <DialogTitle>
          Deposit
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send
            updates occationally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClose() {
    this.setState({
      dialogVisible: false,
    });
  }
}

DepositDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DepositDialog)));
