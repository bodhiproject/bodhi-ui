import React from 'react';
import { Button, Typography, withStyles, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';

import styles from './styles';

const TxSentDialog = ({ classes, store: { txSentDialog } }) => (
  <Dialog open={txSentDialog.visible} onClose={txSentDialog.onClose}>
    <DialogTitle><FormattedMessage id="transactionSentDialog.successMsg" defaultMessage="Success" /></DialogTitle>
    <DialogContent>
      <Typography variant="body1" className={classes.bodyPrimary}>
        <FormattedMessage
          id="transactionSentDialog.waitingMsg"
          defaultMessage="Transaction sent. Waiting for confirmations."
        />
      </Typography>
      <Typography variant="body1">
        <FormattedMessage
          id="str.transactionIdX"
          defaultMessage="Transaction ID: {txid}"
          values={{ txid: txSentDialog.txid }}
        />
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={txSentDialog.onClose}>
        <FormattedMessage id="str.ok" defaultMessage="Ok" />
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles)(inject('store')(observer(TxSentDialog)));
