import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  txConfirmInfoAndCallback: state.App.get('txConfirmInfoAndCallback'),
}), (dispatch) => ({
  clearTxConfirm: () => dispatch(appActions.clearTxConfirm()),
}))

export default class TxConfirmDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    txConfirmInfoAndCallback: PropTypes.object.isRequired,
    clearTxConfirm: PropTypes.func.isRequired,
  }

  render() {
    const {
      classes,
      txConfirmInfoAndCallback,
    } = this.props;

    const {
      txDesc,
      txAmount,
      txToken,
      confirmCallback,
    } = txConfirmInfoAndCallback;

    const isOpen =
      !_.isUndefined(txDesc) && !_.isUndefined(txAmount) &&
      !_.isUndefined(txToken) && _.isFunction(confirmCallback);

    return (
      <Dialog open={isOpen}>
        <DialogTitle>Please Confirm Your Transaction</DialogTitle>
        <DialogContent>
          You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onOkClicked}>
            <FormattedMessage id="str.ok" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onClose = () => {
    this.props.clearTxConfirm();
  }

  onOkClicked = () => {
    const callback = this.props.txConfirmInfoAndCallback.confirmCallback;
    if (callback) {
      callback();
    }
    this.props.clearTxConfirm();
  }
}
