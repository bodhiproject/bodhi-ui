import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { TableBody, TableRow, TableCell, Button, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Warning, ResponsiveTable } from 'components';
import Icon from '../Icon';
import Container from '../Container';
import Label from '../Label';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import { toFixed } from '../../../helpers/utility';
import styles from './styles';


const useTableRowStyles = makeStyles(() => ({
  root: {
    border: '1px solid rgba(151, 151, 151, 0.1)',
  },
}));

const messages = defineMessages({
  escrow: {
    id: 'str.escrow',
    defaultMessage: 'Escrow',
  },
  totalBet: {
    id: 'str.totalBet',
    defaultMessage: 'Your Total Bet',
  },
  totalBetReturn: {
    id: 'str.totalBetReturn',
    defaultMessage: 'Your Total Bet Return',
  },
  totalVote: {
    id: 'str.totalVote',
    defaultMessage: 'Your Total Vote',
  },
  totalVoteReturn: {
    id: 'str.totalVoteReturn',
    defaultMessage: 'Your Total Vote Return',
  },
  totalReturn: {
    id: 'str.totalReturn',
    defaultMessage: 'Your Total Return',
  },
});

const WithdrawTo = observer(({ store: { eventPage: { withdrawableAddress }, wallet: { currentAddress } } }) => {
  if (currentAddress !== '') {
    return (<Container>
      <WalletIcon />
      <WithdrawToLabel />
      <WithdrawList withdrawableAddress={withdrawableAddress} />
      <WithdrawButton />
    </Container>);
  }
  return <Fragment />;
});

const WalletIcon = () => <Icon type='wallet' />;

const FormattedMessageFixed = (props) => <FormattedMessage {...props} />;

const WithdrawToLabel = () => (
  <Label>
    <FormattedMessage id="withdrawDetail.detail" defaultMessage="Detail">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const WithdrawButton = withStyles(styles)(inject('store')(observer(({ store, classes }) => {
  const { eventPage: { didWithdraw, pendingWithdraw, withdraw } } = store;
  const { id, message, warningType, disabled } = getActionButtonConfig(
    pendingWithdraw,
    didWithdraw,
  );

  return (
    <Fragment>
      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={disabled}
        className={classes.button}
        onClick={() => withdraw()}
      >
        <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
      </Button>
      {disabled && <Warning id={id} message={message} className={warningType} />}
    </Fragment>
  );
})));


const WithdrawList = ({
  withdrawableAddress: {
    escrow,
    yourTotalBets,
    yourTotalBetsReturn,
    yourTotalBetsReturnRate,
    yourTotalVotes,
    yourTotalVotesReturn,
    yourTotalVotesReturnRate,
    yourTotalReturn,
    yourTotalReturnRate,
  },
}) => (
  <ResponsiveTable>
    <TableBody>
      <CustomTableRow text='escrow' value={escrow} />
      <CustomTableRow text='totalBet' value={yourTotalBets} />
      <CustomTableRow text='totalBetReturn' value={yourTotalBetsReturn} percent={yourTotalBetsReturnRate} />
      <CustomTableRow text='totalVote' value={yourTotalVotes} />
      <CustomTableRow text='totalVoteReturn' value={yourTotalVotesReturn} percent={yourTotalVotesReturnRate} />
      <CustomTableRow text='totalReturn' value={yourTotalReturn} percent={yourTotalReturnRate} />
    </TableBody>
  </ResponsiveTable>
);


const CustomTableRow = ({ text, value, percent }) => {
  const classes = useTableRowStyles();
  if (!value || value === 0) return null;
  return (
    <TableRow className={classes.root}>
      <TableCell className={classes.root}><FormattedMessageFixed id={messages[text].id} defaultMessage={messages[text].defaultMessage} /></TableCell>
      <TableCell className={classes.root}>{`${toFixed(value)} ${percent ? `(${toFixed(percent)}%)` : ''}`}</TableCell>
    </TableRow>
  );
};

const getActionButtonConfig = (pendingWithdraw, didWithdraw) => {
  // Already withdrawn with this address
  if (didWithdraw) {
    return {
      show: true,
      disabled: true,
      id: 'withdrawDetail.alreadyWithdrawn',
      message: 'You have already withdrawn',
      warningTypeClass: 'withdrawn',
    };
  }

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

  return {
    show: true,
    disabled: false,
  };
};

export default injectIntl(inject('store')(WithdrawTo));
