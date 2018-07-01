import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import Config from '../../config/app';

const messages = defineMessages({
  walletPassphrase: {
    id: 'walletUnlockDialog.walletPassphrase',
    defaultMessage: 'Wallet Passphrase',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
export default class WalletUnlockDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  state = {
    passphrase: '',
    unlockMinutes: Config.defaults.unlockWalletMins,
  }

  handleChange = (name) => ({ target: { value } }) => {
    this.setState({ [name]: value });
  }

  unlock = () => {
    const { passphrase, unlockMinutes } = this.state;
    const { walletUnlockDialog } = this.props.store;

    this.closeDialog();
    walletUnlockDialog.unlockWallet(passphrase, unlockMinutes);
  }

  closeDialog = () => {
    this.props.store.walletUnlockDialog.isVisible = false;
  }

  render() {
    const { intl, classes } = this.props;
    const { isVisible } = this.props.store.walletUnlockDialog;

    return (
      <Dialog open={isVisible} onClose={this.onOkClicked}>
        <DialogTitle>
          <FormattedMessage id="walletUnlockDialog.unlockWallet" defaultMessage="Unlock Wallet" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.bodyPrimary}>
            <FormattedMessage
              id="walletUnlockDialog.walletPassphraseRequired"
              defaultMessage="This action requires you to unlock this wallet. Please enter your wallet passphrase."
            />
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="passphrase"
            label={intl.formatMessage(messages.walletPassphrase)}
            type="password"
            fullWidth
            onChange={this.handleChange('passphrase')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.unlock}>
            <FormattedMessage id="walletUnlockDialog.unlock" defaultMessage="Unlock" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
