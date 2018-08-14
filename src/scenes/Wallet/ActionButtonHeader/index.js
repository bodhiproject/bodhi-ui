import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withStyles, Button, Tooltip } from '@material-ui/core';

import styles from './styles';
import EncryptDialog from './EncryptDialog';
import EncryptStatusDialog from './EncryptStatusDialog';
import RestoreWalletDialog from './RestoreWalletDialog';
import ChangePassphraseDialog from './ChangePassphraseDialog';
import ChangePassphraseStatusDialog from './ChangePassphraseStatusDialog';


const messages = defineMessages({
  encrypt: {
    id: 'str.encrypt',
    defaultMessage: 'Encrypts the wallet with a passphrase. This is for first time encryption. After encrypting, you will have to use this passphrase to unlock your wallet when starting Bodhi.',
  },
  backup: {
    id: 'str.backup',
    defaultMessage: 'Creates a backup wallet data file which can be restored later.',
  },
  restore: {
    id: 'str.restore',
    defaultMessage: 'Restores your backed up wallet data file. This will add all the addresses from the backed up wallet to your current wallet.',
  },
  encryptButton: {
    id: 'button.encrypt',
    defaultMessage: 'Encrypt',
  },
  backupButton: {
    id: 'button.backup',
    defaultMessage: 'Backup',
  },
  restoreButton: {
    id: 'button.restore',
    defaultMessage: 'Restore',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ActionButtonHeader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    encryptDialogVisible: false,
    restoreDialogVisible: false,
    passphraseChangeDialogVisible: false,
  }

  render() {
    const { classes } = this.props;
    const { backupWallet } = this.props.store.wallet;
    const { encryptDialogVisible, restoreDialogVisible, passphraseChangeDialogVisible } = this.state;
    return (
      <div className={classes.functionRow}>
        <Tip onClick={() => { this.setState({ encryptDialogVisible: true }); }}>encrypt</Tip>
        <Tip onClick={backupWallet}>backup</Tip>
        <Tip onClick={() => { this.setState({ restoreDialogVisible: true }); }}>restore</Tip>
        <EncryptDialog
          dialogVisible={encryptDialogVisible}
          onClose={() => { this.setState({ encryptDialogVisible: false }); }}
          openPassphraseChangeDialog={() => this.setState({ passphraseChangeDialogVisible: true })}
        />
        <EncryptStatusDialog />
        <RestoreWalletDialog
          dialogVisible={restoreDialogVisible}
          onClose={() => { this.setState({ restoreDialogVisible: false }); }}
        />
        <ChangePassphraseDialog
          dialogVisible={passphraseChangeDialogVisible}
          onClose={() => this.setState({ passphraseChangeDialogVisible: false })}
          closeEncryptDialog={() => this.setState({ encryptDialogVisible: false })}
        />
        <ChangePassphraseStatusDialog />
      </div>
    );
  }
}

const Tip = injectIntl(withStyles(styles, { withTheme: true })(({ children, classes, intl, theme, ...props }) => (
  <Tooltip id="tooltip-icon" title={intl.formatMessage(messages[children])}>
    <Button variant="raised" color="primary" className={classes.button} {...props}>
      {intl.formatMessage(messages[`${children}Button`])}
    </Button>
  </Tooltip>
)));
