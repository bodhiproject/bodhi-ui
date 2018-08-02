import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { TransactionStatus, TransactionType, Token } from 'constants';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, TableBody, TableHead, TableRow, TableCell, Button } from '@material-ui/core';
import { Warning } from 'components';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

const WithdrawTo = observer(({ store: { eventPage: { withdrawableAddresses } } }) => (
  <Container>
    <WalletIcon />
    <WithdrawToLabel />
    <WithdrawList withdrawableAddresses={withdrawableAddresses} />
  </Container>
));

const WalletIcon = () => <Icon type='wallet' />;

const WithdrawToLabel = () => (
  <Label>
    <FormattedMessage id="withdrawDetail.withdrawTo" defaultMessage="WITHDRAW TO">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const WithdrawList = ({ withdrawableAddresses }) => (
  <Table>
    <TableHeader />
    <TableBody>
      {withdrawableAddresses.map((addr, i) => <WinningWithdrawRow addr={addr} key={i} />)}
    </TableBody>
  </Table>
);

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell padding="dense">
        <FormattedMessage id="str.address" defaultMessage="Address" />
      </TableCell>
      <TableCell padding="dense">
        <FormattedMessage id="str.type" defaultMessage="Type" />
      </TableCell>
      <TableCell padding="dense">
        <FormattedMessage id="str.amount" defaultMessage="Amount" />
      </TableCell>
      <TableCell padding="dense">
        <FormattedMessage id="str.actions" defaultMessage="Actions" />
      </TableCell>
    </TableRow>
  </TableHead>
);


const WinningWithdrawRow = inject('store')(observer(({ addr: { address, type, botWon, qtumWon }, store }) => {
  const { eventPage } = store;
  const { id, message, warningType, disabled } = getActionButtonConfig({ type, address }, eventPage.withdrawableAddresses, eventPage.transactions, eventPage.address);
  // TODO: the below commented out code is how this should be done
  // const { transactions, withdrawableAddresses, address: topicAddress } = eventPage;
  // // Already have a pending tx for this Topic
  // const isPending = _.filter(transactions, {
  //   type,
  //   status: TransactionStatus.PENDING,
  //   topicAddress: address,
  //   senderAddress: address,
  // }).length > 0;
  // console.log('IS PENDING: ', isPending);

  // // Already withdrawn with this address
  // const alreadyWithdrawn = _.filter(transactions, {
  //   type,
  //   status: TransactionStatus.SUCCESS,
  //   topicAddress,
  //   senderAddress: address,
  // }).length > 0;
  // console.log('ALREADY WITHDRAWN: ', alreadyWithdrawn);

  // const canWithdraw = !_.isEmpty(_.find(withdrawableAddresses, { type, address }));
  // console.log('CAN WITHDRAW: ', canWithdraw);
  // const disabled = !canWithdraw || isPending || alreadyWithdrawn;
  // const id = isPending ? 'str.pendingTransactionDisabledMsg' : 'withdrawDetail.alreadyWithdrawn';
  // const message = isPending ? 'You have a pending transaction for this event. Please wait until it\'s confirmed before doing another transaction.' : 'You have already withdrawn with this address.';
  // const warningType = isPending ? 'pending' : 'withdrawn';

  const botWonText = botWon ? `${botWon} ${Token.BOT}` : '';
  const qtumWonText = qtumWon ? `${qtumWon} ${Token.QTUM}` : '';

  return (
    <TableRow>
      <TableCell padding="dense">
        <Address>{address}</Address>
        {disabled && <Warning id={id} message={message} className={warningType} />}
      </TableCell>
      <TableCell padding="dense">
        {type === TransactionType.WITHDRAW_ESCROW && (
          <FormattedMessage id="str.escrow" defaultMessage="Escrow">
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        )}
        {type === TransactionType.WITHDRAW && (
          <FormattedMessage id="str.winnings" defaultMessage="Winnings">
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        )}
      </TableCell>
      <TableCell padding="dense">
        {`${botWonText}${!_.isEmpty(botWonText) && !_.isEmpty(qtumWonText) ? ', ' : ''}${qtumWonText}`}
      </TableCell>
      <TableCell padding="dense">
        <Button
          size="small"
          variant="raised"
          color="primary"
          disabled={disabled}
          onClick={() => eventPage.withdraw(address, type)}
        >
          <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
        </Button>
      </TableCell>
    </TableRow>
  );
}));


const getActionButtonConfig = (withdrawableAddress, withdrawableAddresses, getTransactionsReturn, address) => {
  // Already have a pending tx for this Topic
  let pendingTxs = _.filter(getTransactionsReturn, {
    type: withdrawableAddress.type,
    status: TransactionStatus.PENDING,
    topicAddress: address,
    senderAddress: withdrawableAddress.address,
  });
  if (pendingTxs.length > 0) {
    return {
      show: true,
      disabled: true,
      id: 'str.pendingTransactionDisabledMsg',
      message: 'You have a pending transaction for this event. Please wait until it\'s confirmed before doing another transaction.',
      warningTypeClass: 'pending',
    };
  }

  // Already withdrawn with this address
  pendingTxs = _.filter(getTransactionsReturn, {
    type: withdrawableAddress.type,
    status: TransactionStatus.SUCCESS,
    topicAddress: address,
    senderAddress: withdrawableAddress.address,
  });
  if (pendingTxs.length > 0) {
    return {
      show: true,
      disabled: true,
      id: 'withdrawDetail.alreadyWithdrawn',
      message: 'You have already withdrawn with this address.',
      warningTypeClass: 'withdrawn',
    };
  }

  // Can withdraw winnings
  if (_.find(withdrawableAddresses, {
    type: withdrawableAddress.type,
    address: withdrawableAddress.address,
  })) {
    return {
      show: true,
      disabled: false,
    };
  }

  return {
    show: true,
    disabled: true,
  };
};

const Address = styled.div`
  word-break: break-all;
`;

export default injectIntl(inject('store')(WithdrawTo));
