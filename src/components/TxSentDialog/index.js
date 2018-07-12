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
import { injectIntl } from 'react-intl';

import styles from './styles';


const TxSentDialog = ({ txid, open, onClose, intl, classes }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{intl.formatMessage({ id: 'transactionSentDialog.successMsg' })}</DialogTitle>
    <DialogContent>
      <Typography variant="body1" className={classes.bodyPrimary}>{intl.formatMessage({ id: 'transactionSentDialog.waitingMsg' })}</Typography>
      <Typography variant="body1">{`${intl.formatMessage({ id: 'str.transactionId' })}: ${txid}`}</Typography>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={onClose}>
        {intl.formatMessage({ id: 'str.transactionId' })}
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles)(injectIntl(TxSentDialog));
