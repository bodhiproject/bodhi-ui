import React, { Fragment } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { TransactionStatus, TransactionType, Token } from 'constants';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TableBody, TableHead, TableRow, TableCell, Button, withStyles } from '@material-ui/core';
import { Warning, ResponsiveTable } from 'components';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import styles from './styles';

const WithdrawTo = observer(({ store: { eventPage: { withdrawableAddresses } } }) => {
  if (withdrawableAddresses.length > 0) {
    return (<Container>
      <WalletIcon />
      <WithdrawToLabel />
      <WithdrawList withdrawableAddresses={withdrawableAddresses} />
    </Container>);
  }
  return <Fragment />;
});

const WalletIcon = () => <Icon type='wallet' />;

const WithdrawToLabel = () => (
  <Label>
    <FormattedMessage id="withdrawDetail.withdrawTo" defaultMessage="WITHDRAW TO">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const WithdrawList = withStyles(styles)(({ withdrawableAddresses }) => (
  <ResponsiveTable>
    <TableHeader />
    <TableBody>
      {withdrawableAddresses.map((addr, i) => <WinningWithdrawRow addr={addr} key={i} />)}
    </TableBody>
  </ResponsiveTable>
));

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


const WinningWithdrawRow = inject('store')(observer(({ addr: { address, type, nbotWon, nakaWon }, store, key }) => {
  const { eventPage } = store;
  const { id, message, warningType, disabled } = getActionButtonConfig(
    { type, address },
    eventPage.withdrawableAddresses,
    eventPage.transactionHistoryItems,
    eventPage.address,
  );
  const nbotWonText = nbotWon ? `${nbotWon} ${Token.NBOT}` : '';
  const nakaWonText = nakaWon ? `${nakaWon} ${Token.NAKA}` : '';

  return (
    <TableRow key={key}>
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
        {`${nbotWonText}${!_.isEmpty(nbotWonText) && !_.isEmpty(nakaWonText) ? ', ' : ''}${nakaWonText}`}
      </TableCell>
      <TableCell padding="dense">
        <Button
          size="small"
          variant="contained"
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
