import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { sumBy } from 'lodash';

import styles from './styles';
import { WalletProvider } from '../../constants';
import { getTxTypeFormatted } from '../../helpers/utility';


const messages = defineMessages({
  txConfirmMessageWithFeeMsg: {
    id: 'txConfirm.messageWithFee',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken} with a maximum transaction fee of {txFee} QTUM. Any unused transaction fees will be refunded to you. Please click OK to continue.',
  },
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
          <TxFeesTable />
          <ExplanationMessage />
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

const SelectWalletSection = withStyles(styles)(inject('store')(({ classes, store: { executeTxDialog } }) => (
  <Grid container className={classes.selectWalletContainer}>
    <Grid item xs={12} sm={5}>
      <Typography className={classes.selectWalletText}>
        <FormattedMessage id="executeTx.selectWalletProvider" defaultMessage="Select your wallet provider:" />
      </Typography>
    </Grid>
    <Grid item xs={12} sm={7}>
      <Select disableUnderline value={executeTxDialog.provider} onChange={e => executeTxDialog.provider = e.target.value}>
        <MenuItem value={WalletProvider.QRYPTO}><FormattedMessage id="str.qrypto" defaultMessage="Qrypto" /></MenuItem>
      </Select>
    </Grid>
  </Grid>
)));

const FormattedMessageCell = injectIntl(({ intl, id, defaultMessage }) => (
  <TableCell>
    {intl.formatMessage({ id, defaultMessage })}
  </TableCell>
));

const TxFeesTable = withStyles(styles)(injectIntl(inject('store')(({ classes, intl, store: { executeTxDialog: { txFees } } }) => {
  if (txFees.length === 0) {
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
        {txFees.map(({ type, amount, gasCost, gasLimit, token }, i) => (
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
})));

const ExplanationMessage = injectIntl(inject('store')(({ intl, store: { executeTxDialog: { txFees, txAction, txOption, txAmount, txToken } } }) => {
  const formattedAction = getTxTypeFormatted(txAction, intl);
  const txDesc = txOption ? `${formattedAction} on ${txOption}` : formattedAction;
  const txFee = sumBy(txFees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
  return (
    <FormattedMessage
      id='txConfirm.messageWithFee'
      defaultMessage='You are about to {txDesc} for {txAmount} {txToken} with a maximum transaction fee of {txFee} QTUM. Any unused transaction fees will be refunded to you. Please click OK to continue.'
      values={{ txDesc, txAmount, txToken, txFee }}
    />
  );
}));
