import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import EncryptDialog from '../EncryptDialog/index';
import EncryptStatusDialog from '../EncryptStatusDialog/index';

import appActions from '../../../../redux/App/actions';

import styles from './styles';

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
    // intl: intlShape.isRequired, // eslint-disable-line react/no-typos
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
    const { classes, encryptResult } = this.props;
    const { encryptDialogVisible } = this.state;
    return (
      <Typography align="right" className={classes.functionRow}>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onEncryptClicked}>
          <FormattedMessage id="button.encrypt" defaultMessage="Encrypt" />
        </Button>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onBackup}>
          <FormattedMessage id="button.backup" defaultMessage="Backup" />
        </Button>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onImport}>
          <FormattedMessage id="button.import" defaultMessage="Import" />
        </Button>
        <EncryptDialog
          dialogVisible={encryptDialogVisible}
          onClose={this.handleEncryptDialogClose}
          onEncryptWallet={this.onEncryptWallet}
        />
        <EncryptStatusDialog
          onClose={this.handleEncryptStatusDialogClose}
          encryptResult={encryptResult}
        />
      </Typography>
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
