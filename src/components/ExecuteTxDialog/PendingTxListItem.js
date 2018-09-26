import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles, Table, TableHead, TableBody, TableRow, TableCell, Typography, Button } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';
import { sumBy } from 'lodash';
import { TransactionType } from 'constants';

import styles from './styles';
import { getTxTypeString } from '../../helpers/stringUtil';

const TransactionFeesTable = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { fees } }) => {
  if (!fees || fees.length === 0) {
    return null;
  }

  return (
    <Table className={classes.txFeesTable}>
      <TableHead>
        <TableRow>
          <TableCell><FormattedMessage id="str.type" defaultMessage="Type" /></TableCell>
          <TableCell><FormattedMessage id="str.amount" defaultMessage="Amount" /></TableCell>
          <TableCell><FormattedMessage id="str.gasLimit" defaultMessage="Gas Limit" /></TableCell>
          <TableCell><FormattedMessage id="str.fee" defaultMessage="Gas Fee (QTUM)" /></TableCell>
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
    </Table>
  );
}))));

const ExplanationMessage = withStyles(styles)(injectIntl(inject('store')(observer(({ classes, intl, tx: { type, fees } }) => {
  const txAction = getTxTypeString(type, intl);
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

const MultipleTransactionMessage = injectIntl(inject('store')(observer(({ intl, tx: { type } }) => {
  const { APPROVE_CREATE_EVENT, CREATE_EVENT, APPROVE_SET_RESULT, SET_RESULT, APPROVE_VOTE, VOTE } = TransactionType;
  if (type === APPROVE_CREATE_EVENT || type === APPROVE_SET_RESULT || type === APPROVE_VOTE) {
    // Get the localized follow-up tx name
    let action;
    if (type === APPROVE_CREATE_EVENT) {
      action = getTxTypeString(CREATE_EVENT, intl);
    } else if (type === APPROVE_SET_RESULT) {
      action = getTxTypeString(SET_RESULT, intl);
    } else {
      action = getTxTypeString(VOTE, intl);
    }

    return (
      <div>
        <Typography variant="body1">
          <FormattedMessage
            id='txConfirm.approveNotice'
            defaultMessage='The {action} action requires you to approve BOT to be transferred first. You will be required to confirm the follow-up {action} transaction after this transaction is successful.'
            values={{ action }}
          />
        </Typography>
      </div>
    );
  }

  return null;
})));

const ActionButtons = withStyles(styles)(injectIntl(inject('store')(({ classes, index, store: { tx } }) => (
  <div className={classes.actionButtonsContainer}>
    <Button
      className={classes.confirmButton}
      variant="raised"
      color="primary"
      size="small"
      onClick={() => tx.confirmTx(index)}
    >
      <Check />
      <FormattedMessage id="str.confirm" defaultMessage="Confirm" />
    </Button>
    <Button variant="raised" color="default" size="small" onClick={() => tx.deleteTx(index)}>
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