import { defineMessages } from 'react-intl';
import { TransactionType } from 'constants';

import { getIntlProvider } from './i18nUtil';

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

export function getTxTypeString(txType, intl) {
  const { formatMessage } = getIntlProvider(intl.locale, intl.messages);

  switch (txType) {
    case TransactionType.APPROVE_CREATE_EVENT:
    case TransactionType.APPROVE_SET_RESULT:
    case TransactionType.APPROVE_VOTE: {
      return formatMessage(strings.approveBotTransfer);
    }
    case TransactionType.CREATE_EVENT: {
      return formatMessage(strings.createEvent);
    }
    case TransactionType.BET: {
      return formatMessage(strings.bet);
    }
    case TransactionType.SET_RESULT: {
      return formatMessage(strings.setResult);
    }
    case TransactionType.VOTE: {
      return formatMessage(strings.vote);
    }
    case TransactionType.FINALIZE_RESULT: {
      return formatMessage(strings.finalizeResult);
    }
    case TransactionType.WITHDRAW: {
      return formatMessage(strings.withdraw);
    }
    case TransactionType.WITHDRAW_ESCROW: {
      return formatMessage(strings.withdrawEscrow);
    }
    case TransactionType.TRANSFER: {
      return formatMessage(strings.transfer);
    }
    case TransactionType.RESET_APPROVE: {
      return formatMessage(strings.resetApproval);
    }
    default: {
      console.error(`Invalid txType: ${txType}`); // eslint-disable-line
      return '';
    }
  }
}
