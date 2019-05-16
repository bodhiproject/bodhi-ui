import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { withStyles, TableHead, TableBody, TableRow, TableCell, Typography, Button } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';
import { sumBy } from 'lodash';
import { TransactionType } from 'constants';
import { Loading, ResponsiveTable } from 'components';

import styles from './styles';
import { getTxTypeString } from '../../helpers/stringUtil';

const messages = defineMessages({
  resetApprove: {
    id: 'txConfirm.resetApprove',
    defaultMessage: 'You are trying to use more NBOT than your currently approved amount. This will require you to reset the approved amount to 0 first before you can increase it. Or you can change the amount up to the current approved amount.',
  },
  approveNotice: {
    id: 'txConfirm.approveNotice',
    defaultMessage: 'The {action} action requires you to approve NBOT to be transferred first. You will be required to confirm the follow-up {action} transaction after this transaction is successful.',
  },
});

const TransactionFeesTable = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { fees } }) => (
  <ResponsiveTable className={classes.txFeesTable}>
    <TableHead>
      <TableRow>
        <TableCell><FormattedMessage id="str.type" defaultMessage="Type" /></TableCell>
        <TableCell><FormattedMessage id="str.amount" defaultMessage="Amount" /></TableCell>
        <TableCell><FormattedMessage id="str.gasLimit" defaultMessage="Gas Limit" /></TableCell>
        <TableCell><FormattedMessage id="str.fee" defaultMessage="Gas Fee (NAKA)" /></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {fees.map(({ type, amount, gasCost, gasLimit, token }, i) => (
        <TableRow key={i}>
          <TableCell>{getTxTypeString(type, intl)}</TableCell>
          <TableCell>{amount ? `${amount} ${token}` : null}</TableCell>
          <TableCell>{gasLimit}</TableCell>
          <TableCell>{gasCost}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </ResponsiveTable>
)))));

const ExplanationMessage = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { type, fees } }) => {
  const txAction = getTxTypeString(type, intl);
  const txFee = sumBy(fees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
  return (
    <div className={classes.explanationMsgContainer}>
      <Typography variant="body2">
        <FormattedMessage
          id='txConfirm.txFeeMsg'
          defaultMessage='You are about to {txAction} with a maximum transaction fee of {txFee} NAKA.'
          values={{ txAction, txFee }}
        />
      </Typography>
    </div>
  );
}))));

const MultipleTransactionMessage = injectIntl(inject('store')(observer(({ intl, tx: { type } }) => {
  const {
    RESET_APPROVE,
    APPROVE_CREATE_EVENT,
    CREATE_EVENT,
    APPROVE_SET_RESULT,
    SET_RESULT,
    APPROVE_VOTE,
    VOTE,
  } = TransactionType;
  if (type === RESET_APPROVE || type === APPROVE_CREATE_EVENT || type === APPROVE_SET_RESULT || type === APPROVE_VOTE) {
    // Get the localized follow-up tx name
    const action = {
      [RESET_APPROVE]: getTxTypeString(RESET_APPROVE, intl),
      [APPROVE_CREATE_EVENT]: getTxTypeString(CREATE_EVENT, intl),
      [APPROVE_SET_RESULT]: getTxTypeString(SET_RESULT, intl),
      [APPROVE_VOTE]: getTxTypeString(VOTE, intl),
    }[type];

    let message;
    if (type === RESET_APPROVE) {
      message = messages.resetApprove;
    } else {
      message = messages.approveNotice;
    }

    return (
      <div>
        <Typography variant="body2">{intl.formatMessage(message, { action })}</Typography>
      </div>
    );
  }

  return null;
})));

const ActionButtons = withStyles(styles)(injectIntl(inject('store')(({ classes, index, store: { tx } }) => (
  <div className={classes.actionButtonsContainer}>
    <Button
      className={classes.confirmButton}
      variant="contained"
      color="primary"
      size="small"
      onClick={() => tx.confirmTx(index)}
    >
      <Check className={classes.buttonIcon} />
      <FormattedMessage id="str.confirm" defaultMessage="Confirm" />
    </Button>
    <Button variant="contained" color="default" size="small" onClick={() => tx.deleteTx(index)}>
      <Clear className={classes.buttonIcon} />
      <FormattedMessage id="str.delete" defaultMessage="Delete" />
    </Button>
  </div>
))));

const PendingTxListItem = (props, classes) => (
  <div className={classes.listItemContainer}>
    {!props.tx.fees || props.tx.fees.length === 0 ? (
      <Loading />
    ) : (
      <div>
        <TransactionFeesTable {...props} />
        <ExplanationMessage {...props} />
        <MultipleTransactionMessage {...props} />
        <ActionButtons {...props} />
      </div>
    )}
  </div>
);

export default withStyles(styles)(injectIntl(inject('store')(observer(PendingTxListItem))));
