import { defineMessages } from 'react-intl';

import { getIntlProvider } from './i18nUtil';
import { TransactionType } from '../constants';

const strings = defineMessages({
  resetApproval: {
    id: 'tx.resetApproval',
    defaultMessage: 'Reset Approval',
  },
  approveBotTransfer: {
    id: 'tx.approveBotTransfer',
    defaultMessage: 'Approve BOT Transfer',
  },
  createEvent: {
    id: 'str.createEvent',
    defaultMessage: 'Create Event',
  },
  bet: {
    id: 'str.bet',
    defaultMessage: 'Bet',
  },
  setResult: {
    id: 'str.setResult',
    defaultMessage: 'Set Result',
  },
  vote: {
    id: 'str.vote',
    defaultMessage: 'Vote',
  },
  finalizeResult: {
    id: 'str.finalizeResult',
    defaultMessage: 'Finalize Result',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
  withdrawEscrow: {
    id: 'str.withdrawEscrow',
    defaultMessage: 'Withdraw Escrow',
  },
  transfer: {
    id: 'str.transfer',
    defaultMessage: 'Transfer',
  },
});

export function getTxTypeString(txType, locale, localeMessages) {
  const { formatMessage } = getIntlProvider(locale, localeMessages);

  switch (txType) {
    case TransactionType.ApproveCreateEvent:
    case TransactionType.ApproveSetResult:
    case TransactionType.ApproveVote: {
      return formatMessage(strings.approveBotTransfer);
    }
    case TransactionType.CreateEvent: {
      return formatMessage(strings.createEvent);
    }
    case TransactionType.Bet: {
      return formatMessage(strings.bet);
    }
    case TransactionType.SetResult: {
      return formatMessage(strings.setResult);
    }
    case TransactionType.Vote: {
      return formatMessage(strings.vote);
    }
    case TransactionType.FinalizeResult: {
      return formatMessage(strings.finalizeResult);
    }
    case TransactionType.Withdraw: {
      return formatMessage(strings.withdraw);
    }
    case TransactionType.WithdrawEscrow: {
      return formatMessage(strings.withdrawEscrow);
    }
    case TransactionType.Transfer: {
      return formatMessage(strings.transfer);
    }
    case TransactionType.ResetApprove: {
      return formatMessage(strings.resetApproval);
    }
    default: {
      console.error(`Invalid txType: ${txType}`); // eslint-disable-line
      return '';
    }
  }
}
