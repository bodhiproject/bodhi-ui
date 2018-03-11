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
import graphqlActions from '../../redux/Graphql/actions';

const messages = defineMessages({
  walletPassphrase: {
    id: 'walletUnlockDialog.walletPassphrase',
    defaultMessage: 'Wallet Passphrase',
  },
});

class WalletUnlockDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-typos
    intl: intlShape.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.onUnlockClicked = this.onUnlockClicked.bind(this);
  }

  render() {
    const {
      intl,
      classes,
      dialogVisible,
    } = this.props;

    return (
      <Dialog
        open={dialogVisible}
        onClose={this.onOkClicked}
      >
        <DialogTitle>
          <FormattedMessage id="messages.unlockWallet" defaultMessage="Unlock Wallet" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.bodyPrimary}>
            <FormattedMessage
              id="messages.walletPassphraseRequired"
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
        </DialogContent>
        <DialogActions>
          <Button>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onUnlockClicked}>
            <FormattedMessage id="walletUnlockDialog.unlock" defaultMessage="Unlock" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onUnlockClicked() {
  }
}

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(WalletUnlockDialog)));
