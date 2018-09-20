import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { withStyles, Table, TableHead, TableBody, TableRow, TableCell, Typography, Button } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';
import { sumBy } from 'lodash';
import { TransactionType } from 'constants';

import styles from './styles';
import { getTxTypeFormatted } from '../../helpers/utility';

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

const TransactionFeesTable = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { fees } }) => {
  if (!fees || fees.length === 0) {
    return null;
  }

  return (
    <Table className={classes.txFeesTable}>
      <TableHead>
        <TableRow>
          <FormattedMessageCell id={messages.strTypeMsg.id} defaultMessage={messages.strTypeMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strAmountMsg.id} defaultMessage={messages.strAmountMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strGasLimitMsg.id} defaultMessage={messages.strGasLimitMsg.defaultMessage} />
          <FormattedMessageCell id={messages.strFeeMsg.id} defaultMessage={messages.strFeeMsg.defaultMessage} />
        </TableRow>
      </TableHead>
      <TableBody>
        {fees.map(({ type, amount, gasCost, gasLimit, token }, i) => (
          <TableRow key={i}>
            <TableCell>{intl.formatMessage({ id: `txType.${type}`, defaultMessage: '' })}</TableCell>
            <TableCell>{amount ? `${amount} ${token}` : null}</TableCell>
            <TableCell>{gasLimit}</TableCell>
            <TableCell>{gasCost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}))));

const ExplanationMessage = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { type, fees } }) => {
  const txAction = getTxTypeFormatted(type, intl);
  const txFee = sumBy(fees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
  return (
    <div className={classes.explanationMsgContainer}>
      <Typography variant="body1">
        <FormattedMessage
          id='txConfirm.txFeeMsg'
          defaultMessage='You are about to {txAction} with a maximum transaction fee of {txFee} QTUM.'
          values={{ txAction, txFee }}
        />
      </Typography>
    </div>
  );
}))));

const MultipleTransactionMessage = injectIntl(inject('store')(observer(({ tx: { type } }) => {
  const { APPROVE_CREATE_EVENT, CREATE_EVENT, APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE } = TransactionType;
  if (type === APPROVE_CREATE_EVENT || type === APPROVE_SET_RESULT || type === APPROVE_VOTE) {
    return (
      <div>
        <Typography variant="body1">
          <FormattedMessage
            id='txConfirm.txOne'
            defaultMessage='Confirmation for transaction 1/2. You will be required to confirm another transaction when this transaction is successful.'
          />
        </Typography>
      </div>
    );
  } else if (type === CREATE_EVENT || type === SET_RESULT || type === VOTE) {
    return (
      <div>
        <FormattedMessage id='txConfirm.txTwo' defaultMessage='Confirmation for transaction 2/2.' />
      </div>
    );
  }
  return null;
})));

const ActionButtons = withStyles(styles)(injectIntl(inject('store')(({ classes, index, store: { tx } }) => (
  <div className={classes.actionButtonsContainer}>
    <Button
      className={classes.confirmButton}
      variant="outlined"
      color="primary"
      size="small"
      onClick={() => tx.confirmTx(index)}
    >
      <Check />
      <FormattedMessage id="str.confirm" defaultMessage="Confirm" />
    </Button>
    <Button variant="outlined" size="small" onClick={() => tx.deleteTx(index)}>
      <Clear />
      <FormattedMessage id="str.delete" defaultMessage="Delete" />
    </Button>
  </div>
))));

const PendingTxListItem = (props) => (
  <div>
    <TransactionFeesTable {...props} />
    <ExplanationMessage {...props} />
    <MultipleTransactionMessage {...props} />
    <ActionButtons {...props} />
  </div>
);

export default withStyles(styles)(injectIntl(inject('store')(observer(PendingTxListItem))));
