import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import appActions from '../../redux/App/actions';
import Config from '../../config/app';

const messages = defineMessages({
  walletPassphrase: {
    id: 'walletUnlockDialog.walletPassphrase',
    defaultMessage: 'Wallet Passphrase',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  walletUnlockDialogVisibility: state.App.get('walletUnlockDialogVisibility'),
}), (dispatch) => ({
  toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
  unlockWallet: (passphrase, timeout) => dispatch(appActions.unlockWallet(passphrase, timeout)),
}))
export default class WalletUnlockDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    walletUnlockDialogVisibility: PropTypes.bool.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
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
    this.props.unlockWallet(passphrase, unlockMinutes);
    this.props.toggleWalletUnlockDialog(false);
  }

  render() {
    const { intl, classes, walletUnlockDialogVisibility } = this.props;

    return (
      <Dialog open={walletUnlockDialogVisibility} onClose={this.onOkClicked}>
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
          <Button onClick={() => this.props.toggleWalletUnlockDialog(false)}>
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
