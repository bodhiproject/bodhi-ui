import React, { Fragment } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { TransactionStatus, TransactionType, Token } from 'constants';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TableBody, TableHead, TableRow, TableCell, Button, withStyles } from '@material-ui/core';
import { Warning, ResponsiveTable } from 'components';
import Icon from '../Icon';
import Container from '../Container';
import Label from '../Label';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

const WithdrawTo = observer(({ store: { eventPage: { withdrawableAddress }, wallet: { currentAddress } } }) => {
  if (currentAddress !== '') {
    return (<Container>
      <WalletIcon />
      <WithdrawToLabel />
      <WithdrawList withdrawableAddress={withdrawableAddress} />
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

const WithdrawList = ({ withdrawableAddress }) => (
  <ResponsiveTable>
    <TableHeader />
    <TableBody>
      <WinningWithdrawRow addr={withdrawableAddress} />
    </TableBody>
  </ResponsiveTable>
);

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell padding="dense">
        <FormattedMessage id="str.address" defaultMessage="Address" />
      </TableCell>
      <TableCell padding="dense">
        <FormattedMessage id="str.escrow" defaultMessage="Escrow" />
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


const WinningWithdrawRow = inject('store')(observer(({ addr: { address, escrowAmount, nbotWinnings }, store, key }) => {
  const { eventPage: { didWithdraw, pendingWithdraw, withdraw } } = store;
  const { id, message, warningType, disabled } = getActionButtonConfig(
    pendingWithdraw,
    didWithdraw,
  );
  console.log(1);

  return (
    <TableRow key={key}>
      <TableCell padding="dense">
        <Address>{address}</Address>
        {disabled && <Warning id={id} message={message} className={warningType} />}
      </TableCell>
      <TableCell padding="dense">
        {escrowAmount}
      </TableCell>
      <TableCell padding="dense">
        {nbotWinnings}
      </TableCell>
      <TableCell padding="dense">
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={disabled}
          onClick={() => withdraw()}
        >
          <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
        </Button>
      </TableCell>
    </TableRow>
  );
}));


const getActionButtonConfig = (pendingWithdraw, didWithdraw) => {
  // Already have a pending tx for this Topic
  if (pendingWithdraw.length > 0) {
    return {
      show: true,
      disabled: true,
      id: 'str.pendingTransactionDisabledMsg',
      message: 'You have a pending transaction for this event. Please wait until it\'s confirmed before doing another transaction.',
      warningTypeClass: 'pending',
    };
  }

  // Already withdrawn with this address
  if (didWithdraw) {
    return {
      show: true,
      disabled: true,
      id: 'withdrawDetail.alreadyWithdrawn',
      message: 'You have already withdrawn with this address.',
      warningTypeClass: 'withdrawn',
    };
  }

  // // Can withdraw winnings
  // if (_.find(withdrawableAddresses, {
  //   type: withdrawableAddress.type,
  //   address: withdrawableAddress.address,
  // })) {
  //   return {
  //     show: true,
  //     disabled: false,
  //   };
  // }

  return {
    show: true,
    disabled: false,
  };
};

const Address = styled.div`
  word-break: break-all;
`;

export default injectIntl(inject('store')(WithdrawTo));
