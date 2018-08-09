import React from 'react';
import {
  Button,
  Typography,
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';

import styles from './styles';

const messages = defineMessages({
  transactionSentDialogSuccessMsg: {
    id: 'transactionSentDialog.successMsg',
    defaultMessage: 'Success',
  },
  transactionSentDialogWaitingMsg: {
    id: 'transactionSentDialog.waitingMsg',
    defaultMessage: 'Transaction sent. Waiting for confirmations.',
  },
  transactionIdMsg: {
    id: 'str.transactionId',
    defaultMessage: 'Transaction ID',
  },
  okMsg: {
    id: 'str.ok',
    defaultMessage: 'Ok',
  },
});

const TxSentDialog = ({ txid, open, onClose, intl, classes }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{intl.formatMessage(messages.transactionSentDialogSuccessMsg)}</DialogTitle>
    <DialogContent>
      <Typography variant="body1" className={classes.bodyPrimary}>{intl.formatMessage(messages.transactionSentDialogWaitingMsg)}</Typography>
      <Typography variant="body1">{`${intl.formatMessage(messages.transactionIdMsg)}: ${txid}`}</Typography>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={onClose}>
        {intl.formatMessage(messages.okMsg)}
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles)(injectIntl(TxSentDialog));
