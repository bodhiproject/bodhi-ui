import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

const RestoreWalletDialog = injectIntl(({ dialogVisible, onClose }) => (
  <Dialog open={dialogVisible} onClose={onClose}>
    <DialogTitle>
      <FormattedMessage id="wallet.restoreWallet" defaultMessage="Restore Your Wallet" />
    </DialogTitle>
    <DialogContent>
      <FormattedMessage id="wallet.restoreWalletDescription" defaultMessage="Please select Launch Qtum Wallet in the menu and restore your wallet in QT Wallet." />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>
        <FormattedMessage id="str.close" defaultMessage="Close" />
      </Button>
    </DialogActions>
  </Dialog>
));

export default RestoreWalletDialog;
