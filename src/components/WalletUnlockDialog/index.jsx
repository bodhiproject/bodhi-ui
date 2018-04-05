import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
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

export default class WalletUnlockDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    walletUnlockDialogVisibility: PropTypes.bool.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  constructor(props) {
    super(props);

    this.state = {
      passphrase: '',
      unlockMinutes: Config.defaults.unlockWalletMins,
    };

    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.onUnlockClicked = this.onUnlockClicked.bind(this);
  }

  render() {
    const {
      intl,
      classes,
      walletUnlockDialogVisibility,
    } = this.props;
    const { unlockMinutes } = this.state;

    return (
      <Dialog
        open={walletUnlockDialogVisibility}
        onClose={this.onOkClicked}
      >
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
            onChange={this.handlePassphraseChange('passphrase')}
          />
          <div className={classes.unlockMinutesContainer}>
            <FormattedMessage
              id="walletUnlockDialog.keepWalletUnlocked"
              defaultMessage="Keep wallet unlocked for"
            />
            <TextField
              id="unlockMinutes"
              value={unlockMinutes}
              onChange={this.handleUnlockMinutesChange('unlockMinutes')}
              type="number"
              InputLabelProps={{ shrink: true }}
              margin="normal"
              className={classes.unlockMinutesInput}
            />
            <FormattedMessage
              id="str.minutes"
              defaultMessage="Minutes"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancelClicked}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onUnlockClicked}>
            <FormattedMessage id="walletUnlockDialog.unlock" defaultMessage="Unlock" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handlePassphraseChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleUnlockMinutesChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onCancelClicked() {
    this.props.toggleWalletUnlockDialog(false);
  }

  onUnlockClicked() {
    const { unlockWallet, toggleWalletUnlockDialog } = this.props;
    const { passphrase, unlockMinutes } = this.state;

    unlockWallet(passphrase, unlockMinutes);
    toggleWalletUnlockDialog(false);
  }
}
