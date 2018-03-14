import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';

const messages = defineMessages({
  walletPassphrase: {
    id: 'walletUnlockDialog.walletPassphrase',
    defaultMessage: 'Wallet Passphrase',
  },
});

class WalletUnlockDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    walletUnlockDialogVisibility: PropTypes.bool.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      unlockMinutes: 1,
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
            fullWidth
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

  handleUnlockMinutesChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onCancelClicked() {
    this.props.toggleWalletUnlockDialog(false);
  }

  onUnlockClicked() {
    this.props.toggleWalletUnlockDialog(false);
  }
}

const mapStateToProps = (state) => ({
  walletUnlockDialogVisibility: state.App.get('walletUnlockDialogVisibility'),
});

function mapDispatchToProps(dispatch) {
  return {
    toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(WalletUnlockDialog)));
