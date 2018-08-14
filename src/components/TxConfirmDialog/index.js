import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import styles from './styles';

const messages = defineMessages({
  txConfirmMessageMsg: {
    id: 'txConfirm.message',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.',
  },
  txConfirmMessageWithFeeMsg: {
    id: 'txConfirm.messageWithFee',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}, with fee for {txFee} QTUM. Please click OK to continue.',
  },
  strTypeMsg: {
    id: 'str.type',
    defaultMessage: 'Type',
  },
  strAmountMsg: {
    id: 'str.amount',
    defaultMessage: 'Amount',
  },
  strFeeMsg: {
    id: 'str.fee',
    defaultMessage: 'Gas Fee (QTUM)',
  },
  strGasLimitMsg: {
    id: 'str.gasLimit',
    defaultMessage: 'Gas Limit',
  },
});

/**
 * Shows the transactions that the user is approving before executing them. Some txs require 2 different txs.
 * USED IN:
 * - wallet
 * - event page
 * - create event
 */
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TxConfirmDialog extends Component {
  render() {
    const { open, txFees, onConfirm, onClose, txAmount, txToken, txDesc } = this.props;
    const { classes, intl: { formatMessage } } = this.props;

    const txFee = _.sumBy(txFees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
    let confirmMessage = formatMessage(messages.txConfirmMessageMsg, { txDesc, txAmount, txToken });
    if (txFee) {
      confirmMessage = formatMessage(messages.txConfirmMessageWithFeeMsg, { txDesc, txAmount, txToken, txFee });
    }
    if (!open) {
      return null;
    }

    return (
      <Dialog open={open}>
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          {confirmMessage}
          {Boolean(txFees.length) && (
            <Table className={classes.costTable}>
              <TableHead>
                <TableRow>
                  <Cell id={messages.strTypeMsg.id} defaultMessage={messages.strTypeMsg.defaultMessage} />
                  <Cell id={messages.strAmountMsg.id} defaultMessage={messages.strAmountMsg.defaultMessage} />
                  <Cell id={messages.strFeeMsg.id} defaultMessage={messages.strFeeMsg.defaultMessage} />
                  <Cell id={messages.strGasLimitMsg.id} defaultMessage={messages.strGasLimitMsg.defaultMessage} />
                </TableRow>
              </TableHead>
              <TableBody>
                {txFees.map(({ type, amount, gasCost, gasLimit, token }, i) => (
                  <TableRow key={i}>
                    <TableCell>{type}</TableCell>
                    <TableCell>{amount} {token}</TableCell>
                    <TableCell>{gasCost}</TableCell>
                    <TableCell>{gasLimit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={onConfirm}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const Cell = injectIntl(({ id, defaultMessage, intl }) => (
  <TableCell>
    {intl.formatMessage({ id, defaultMessage })}
  </TableCell>
));
