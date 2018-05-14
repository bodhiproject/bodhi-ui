import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import appActions from '../../../../redux/App/actions';

@injectIntl
@connect((state) => ({
  encryptResult: state.App.get('encryptResult'),
}), (dispatch) => ({
  encryptWallet: (passphrase) => dispatch(appActions.encryptWallet(passphrase)),
  clearEncryptResult: () => dispatch(appActions.clearEncryptResult()),
}))
export default class EncryptStatusDialog extends Component {
  static propTypes = {
    encryptResult: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    clearEncryptResult: PropTypes.func.isRequired,
  };

  static defaultProps = {
    encryptResult: undefined,
  };

  render() {
    const { encryptResult } = this.props;
    const isSuccessful = !_.isUndefined(encryptResult) && !_.isObject(encryptResult) && encryptResult.includes('wallet encrypted; Qtum server stopping, restart to run with encrypted wallet.');

    return (
      <Dialog open={!_.isUndefined(encryptResult)}>
        <DialogTitle>
          {isSuccessful ? (
            <FormattedMessage id="encrypt.success" defaultMessage="Encrypt Wallet Successful." />
          ) : (
            <FormattedMessage id="encrypt:fail" defaultMessage="Encrypt Wallet Failed." />
          )}
        </DialogTitle>
        <DialogContent>
          {isSuccessful && <FormattedMessage id="encrypt.restart" defaultMessage="You need to restart Bodhi applciation after successfully encrypt the wallet" />}
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
