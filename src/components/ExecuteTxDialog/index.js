import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import TransactionFeesTable from './TransactionFeesTable';
import ExplanationMessage from './ExplanationMessage';
import MultipleTransactionMessage from './MultipleTransactionMessage';

@inject('store')
@observer
export default class ExecuteTxDialog extends Component {
  render() {
    const { visible } = this.props.store.tx;

    return (
      <Dialog open={visible}>
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          <TransactionFeesTable />
          <ExplanationMessage />
          <MultipleTransactionMessage />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.store.tx.visible = false}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.props.store.tx.onTxConfirmed}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
