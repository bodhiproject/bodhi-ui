import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
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

const messages = defineMessages({
  walletPassphrase: {
    id: 'walletUnlockDialog.walletPassphrase',
    defaultMessage: 'Wallet Passphrase',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class WalletUnlockDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  unlock = () => {
    this.props.store.walletUnlockDialog.unlockWallet();
    this.closeDialog();
  }

  closeDialog = () => {
    const { walletUnlockDialog } = this.props.store;

    walletUnlockDialog.passphrase = '';
    walletUnlockDialog.isVisible = false;
  }

  render() {
    const { intl, classes } = this.props;
    const { walletUnlockDialog } = this.props.store;

    return (
      <Dialog open={walletUnlockDialog.isVisible}>
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
            onChange={(e) => walletUnlockDialog.passphrase = e.target.value}
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
