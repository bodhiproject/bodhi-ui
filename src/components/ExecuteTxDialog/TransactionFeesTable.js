import React from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { defineMessages, injectIntl } from 'react-intl';

import styles from './styles';

const messages = defineMessages({
  txTypeApprove: {
    id: 'txType.approve',
    defaultMessage: 'Approve',
  },
  txTypeSetResult: {
    id: 'txType.setResult',
    defaultMessage: 'Set result',
  },
  txTypeCreateEvent: {
    id: 'txType.createEvent',
    defaultMessage: 'Create event',
  },
  txTypeVote: {
    id: 'txType.vote',
    defaultMessage: 'Vote',
  },
  txTypeWithdraw: {
    id: 'txType.withdraw',
    defaultMessage: 'Withdraw',
  },
  txTypeWithdrawEscrow: {
    id: 'txType.withdrawEscrow',
    defaultMessage: 'Withdraw escrow',
  },
  txTypeFinalizeResult: {
    id: 'txType.finalizeResult',
    defaultMessage: 'Finalize result',
  },
  txTypeBet: {
    id: 'txType.bet',
    defaultMessage: 'Bet',
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

const FormattedMessageCell = injectIntl(({ intl, id, defaultMessage }) => (
  <TableCell>
    {intl.formatMessage({ id, defaultMessage })}
  </TableCell>
));

const TransactionFeesTable = ({ classes, intl, store: { tx: { fees } } }) => {
  if (fees.length === 0) {
    return null;
  }

  return (
    <Table className={classes.txFeesTable}>
      <TableHead>
        <TableRow>
          <FormattedMessageCell id={messages.strTypeMsg.id} defaultMessage={messages.strTypeMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strAmountMsg.id} defaultMessage={messages.strAmountMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strFeeMsg.id} defaultMessage={messages.strFeeMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strGasLimitMsg.id} defaultMessage={messages.strGasLimitMsg.defaultMessage} />
        </TableRow>
      </TableHead>
      <TableBody>
        {fees.map(({ type, amount, gasCost, gasLimit, token }, i) => (
          <TableRow key={i}>
            <TableCell>{intl.formatMessage({ id: `txType.${type}`, defaultMessage: '' })}</TableCell>
            <TableCell>{amount ? `${amount} ${token}` : null}</TableCell>
            <TableCell>{gasCost}</TableCell>
            <TableCell>{gasLimit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default withStyles(styles)(injectIntl(inject('store')(observer(TransactionFeesTable))));
