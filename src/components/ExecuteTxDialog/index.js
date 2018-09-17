import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Select, MenuItem, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import { WalletProvider } from '../../constants';


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ExecuteTxDialog extends Component {
  onOkClick = () => {

  }

  render() {
    const { visible } = this.props.store.executeTxDialog;

    return (
      <Dialog open={visible}>
        <DialogTitle>
          <FormattedMessage id="executeTx.executeTx" defaultMessage="Execute Transaction" />
        </DialogTitle>
        <DialogContent>
          <SelectWalletSection />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.store.executeTxDialog.visible = false}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onOkClick}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const SelectWalletSection = inject('store')(({ store: { executeTxDialog } }) => (
  <div>
    <Typography variant="body1">
      <FormattedMessage id="executeTx.selectWalletProvider" defaultMessage="Select your wallet provider:" />
    </Typography>
    <Select disableUnderline value={executeTxDialog.provider} onChange={e => executeTxDialog.provider = e.target.value}>
      <MenuItem value={WalletProvider.QRYPTO}><FormattedMessage id="str.qrypto" defaultMessage="Qrypto" /></MenuItem>
    </Select>
  </div>
));
