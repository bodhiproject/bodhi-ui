import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { TextField, Button } from 'material-ui';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';

import appActions from '../../../../redux/App/actions';


const messages = defineMessages({
  passphrase: {
    id: 'encrypt.passphrase',
    defaultMessage: 'Passphrse',
  },
});

@injectIntl
@connect((state) => ({
  walletEncrypted: state.App.get('walletEncrypted'),
}), (dispatch) => ({
  encryptWallet: (passphrase) => dispatch(appActions.encryptWallet(passphrase)),
}))
export default class EncryptDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    dialogVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    encryptWallet: PropTypes.func.isRequired,
    walletEncrypted: PropTypes.bool.isRequired,
  }

  state = {
    passphrase: '',
  }

  confirmEncrypt = () => {
    const { passphrase } = this.state;
    const { encryptWallet, onClose } = this.props;
    encryptWallet(passphrase);
    onClose();
  }

  render() {
    const { dialogVisible, onClose, intl, walletEncrypted } = this.props;
    const { passphrase } = this.state;
    return (
      <Dialog open={dialogVisible} onClose={onClose}>
        <DialogTitle>
          <FormattedMessage id="wallet.encryptTitle" defaultMessage="Encrypt Your Wallet" />
        </DialogTitle>
        <DialogContent>
          {walletEncrypted ? (
            <FormattedMessage id="wallet.encrypted" defaultMessage="Your wallet is already encrypted" />
          ) : (
            <span>
              <FormattedMessage id="wallet.encryptLabel" defaultMessage="Please enter passphrase to encrypt your wallet" />
              <TextField
                autoFocus
                margin="dense"
                id="toAddress"
                label={intl.formatMessage(messages.passphrase)}
                type="string"
                fullWidth
                error={_.isEmpty(passphrase)}
                onChange={(e) => this.setState({ passphrase: e.target.value })}
                required
              />
            </span>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
          {!walletEncrypted && (
            <Button color="primary" onClick={this.confirmEncrypt} disabled={passphrase === ''}>
              <FormattedMessage id="wallet.encrypt" defaultMessage="Encrypt" />
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
