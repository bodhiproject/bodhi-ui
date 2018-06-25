import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';

const messages = defineMessages({
  passphrase: {
    id: 'encrypt.passphrase',
    defaultMessage: 'Passphrse',
  },
});
@injectIntl
@inject('store')
@observer
export default class EncryptDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    dialogVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    openPassphraseChangeDialog: PropTypes.func.isRequired,
  }

  confirmEncrypt = () => {
    const { encryptWallet, passphrase } = this.props.store.wallet;
    const { onClose } = this.props;
    encryptWallet(passphrase);
    onClose();
  }

  render() {
    const { dialogVisible, onClose, intl } = this.props;
    const { walletEncrypted, onPassphraseChange, passphrase } = this.props.store.wallet;
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
                type="password"
                fullWidth
                error={_.isEmpty(passphrase)}
                onChange={(e) => onPassphraseChange(e.target.value)}
                required
              />
            </span>
          )}
        </DialogContent>
        <DialogActions>
          {walletEncrypted && (
            <Button color="primary" onClick={this.props.openPassphraseChangeDialog}>
              <FormattedMessage id="wallet.changePassphrase" defaultMessage="Change Passphrase" />
            </Button>
          )}
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
