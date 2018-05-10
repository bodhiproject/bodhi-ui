import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import styles from './styles';
import appActions from '../../../../redux/App/actions';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  encryptResult: state.App.get('encryptResult'),
}), (dispatch) => ({
  encryptWallet: (passphrase) => dispatch(appActions.encryptWallet(passphrase)),
  clearEncryptResult: () => dispatch(appActions.clearEncryptResult()),
}))
export default class EncryptStatusDialog extends Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    encryptResult: PropTypes.object,
    clearEncryptResult: PropTypes.func.isRequired,
  };

  static defaultProps = {
    encryptResult: undefined,
    dialogVisible: false,
  };

  render() {
    const { dialogVisible, onClose, encryptResult } = this.props;
    console.log('​EncryptStatusDialog -> render -> encryptResult', encryptResult);
    const isSuccessful = !_.isUndefined(encryptResult) && (encryptResult.includes('wallet encrypted; Qtum server stopping, restart to run with encrypted wallet.'));

    return (
      <Dialog
        open={!_.isUndefined(encryptResult)}
        onClose={onClose}
      >
        <DialogTitle>
          {
            isSuccessful ?
              <FormattedMessage id="encrypt.success" defaultMessage="Encrypt Wallet Successful." /> :
              <FormattedMessage id="encrypt:fail" defaultMessage="Encrypt Wallet Failed." />
          }
        </DialogTitle>
        <DialogContent>
          {
            isSuccessful && <FormattedMessage id="encrypt.restart" defaultMessage="You need to restart Bodhi applciation after successfully encrypt the wallet" />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.dialogHide}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  dialogHide = () => {
    this.props.clearEncryptResult();
  }
}
