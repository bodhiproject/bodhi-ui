import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import { inject, observer } from 'mobx-react';


@injectIntl
@inject('store')
@observer
export default class ChangePassphraseStatusDialog extends Component {
  render() {
    const { changePassphraseResult } = this.props.store.wallet;
    const isSuccessful = !_.isUndefined(changePassphraseResult) && _.has(changePassphraseResult, 'status');

    return (
      <Dialog open={!_.isUndefined(changePassphraseResult)}>
        <DialogTitle>
          {isSuccessful ? (
            <FormattedMessage id="changePassphrase.success" defaultMessage="Passphrase Change Successful" />
          ) : (
            <FormattedMessage id="changePassphrase.fail" defaultMessage="Passphrase Change Failed" />
          )}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => this.props.store.wallet.changePassphraseResult = undefined}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
