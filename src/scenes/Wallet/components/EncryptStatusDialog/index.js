import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

@injectIntl
@inject('store')
@observer
export default class EncryptStatusDialog extends Component {
  static propTypes = {
    encryptResult: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    encryptResult: undefined,
  };

  render() {
    const { encryptResult, clearEncryptResult } = this.props.store.wallet;

    return (
      <Dialog open={!_.isUndefined(encryptResult)}>
        <DialogTitle>
          <FormattedMessage id="encrypt.success" defaultMessage="Encrypt Wallet Successful." />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage id="encrypt.restart" defaultMessage="You need to restart Bodhi applciation after successfully encrypt the wallet" />
        </DialogContent>
        <DialogActions>
          <Button onClick={clearEncryptResult}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
