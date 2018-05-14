import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape, defineMessages } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import EncryptDialog from '../EncryptDialog/index';
import EncryptStatusDialog from '../EncryptStatusDialog/index';

import appActions from '../../../../redux/App/actions';

import styles from './styles';

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
});

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  encryptResult: state.App.get('encryptResult'),
}), (dispatch) => ({
  backupWallet: () => dispatch(appActions.backupWallet()),
  importWallet: () => dispatch(appActions.importWallet()),
}))
export default class FunctionRow extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    backupWallet: PropTypes.func.isRequired,
    importWallet: PropTypes.func.isRequired,
    encryptResult: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    encryptResult: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      encryptDialogVisible: false,
    };
  }
  render() {
    const { classes, encryptResult, intl } = this.props;
    const { encryptDialogVisible } = this.state;
    return (
      <div className={classes.functionRow}>
        <Tooltip id="tooltip-icon" title={intl.formatMessage(messages.encrypt)}>
          <Button variant="raised" color="primary" className={classes.button} onClick={this.onEncryptClicked}>
            <FormattedMessage id="button.encrypt" defaultMessage="Encrypt" />
          </Button>
        </Tooltip>
        <Tooltip id="tooltip-icon" title={intl.formatMessage(messages.backup)}>
          <Button variant="raised" color="primary" className={classes.button} onClick={this.onBackup}>
            <FormattedMessage id="button.backup" defaultMessage="Backup" />
          </Button>
        </Tooltip>
        <Tooltip id="tooltip-icon" title={intl.formatMessage(messages.restore)}>
          <Button variant="raised" color="primary" className={classes.button} onClick={this.onImport}>
            <FormattedMessage id="button.resotre" defaultMessage="Restore" />
          </Button>
        </Tooltip>
        <EncryptDialog
          dialogVisible={encryptDialogVisible}
          onClose={this.handleEncryptDialogClose}
          onEncryptWallet={this.onEncryptWallet}
        />
        <EncryptStatusDialog
          onClose={this.handleEncryptStatusDialogClose}
          encryptResult={encryptResult}
        />
      </div>
    );
  }


  onBackup = () => {
    this.props.backupWallet();
  }

  onImport = () => {
    this.props.importWallet();
  }

  onEncryptWallet = () => {
    this.setState({
      encryptDialogVisible: false,
    });
  }

  onEncryptClicked = () => {
    this.setState({
      encryptDialogVisible: true,
    });
  }

  handleEncryptDialogClose = () => {
    this.setState({
      encryptDialogVisible: false,
    });
  };
}
