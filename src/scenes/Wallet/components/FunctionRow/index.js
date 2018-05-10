import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
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
    encryptResult: PropTypes.object,
  };

  static defaultProps = {
    encryptResult: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      encryptDialogVisible: false,
      EncryptStatusDialogVisible: false,
    };
  }
  render() {
    const { classes, encryptResult } = this.props;
    console.log('​FunctionRow -> render -> encryptResult', encryptResult);
    const { encryptDialogVisible, EncryptStatusDialogVisible } = this.state;
    return (
      <Typography align="right" className={classes.functionRow}>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onEncryptClicked}>
          Encrypt
        </Button>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onBackup}>
          Backup
        </Button>
        <Button variant="raised" color="primary" className={classes.button} onClick={this.onImport}>
          Importwallet
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

  handleEncryptStatusDialogClose = () => {
    this.setState({
      EncryptStatusDialogVisible: false,
    });
  };
}
