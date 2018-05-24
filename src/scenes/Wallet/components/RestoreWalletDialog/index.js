import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';

@injectIntl
@connect(null, null)
export default class RestoreWalletDialog extends Component {
  static propTypes = {
    dialogVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { dialogVisible, onClose } = this.props;
    return (
      <Dialog open={dialogVisible} onClose={onClose}>
        <DialogTitle>
          <FormattedMessage id="wallet.restoreWallet" defaultMessage="Restore Your Wallet" />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="wallet.restoreWalletDescription" defaultMessage="Please open Qtum Wallet to restore. " />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
