import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../redux/App/actions';

const messages = defineMessages({
  confirmMessage: {
    id: 'txConfirm.message',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.',
  },
});

@injectIntl
@connect((state) => ({
  txConfirmInfoAndCallback: state.App.get('txConfirmInfoAndCallback'),
}), (dispatch) => ({
  clearTxConfirm: () => dispatch(appActions.clearTxConfirm()),
}))
export default class TxConfirmDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    txConfirmInfoAndCallback: PropTypes.object.isRequired,
    clearTxConfirm: PropTypes.func.isRequired,
  }

  render() {
    const { intl: { formatMessage }, txConfirmInfoAndCallback } = this.props;
    const { txDesc, txAmount, txToken, confirmCallback } = txConfirmInfoAndCallback;
    const isOpen = !txDesc && !txAmount && !txToken && _.isFunction(confirmCallback);

    return (
      <Dialog open={isOpen}>
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          {formatMessage(messages.confirmMessage, { txDesc, txAmount, txToken })}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onOkClicked}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
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
