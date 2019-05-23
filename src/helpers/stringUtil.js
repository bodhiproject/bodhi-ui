import { defineMessages } from 'react-intl';
import { TransactionType } from 'constants';

import { getIntlProvider } from './i18nUtil';

const strings = defineMessages({
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
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
});

export function getTxTypeString(txType, intl) {
  const { formatMessage } = getIntlProvider(intl.locale, intl.messages);

  switch (txType) {
    case TransactionType.CREATE_EVENT: {
      return formatMessage(strings.createEvent);
    }
    case TransactionType.BET: {
      return formatMessage(strings.bet);
    }
    case TransactionType.RESULT_SET: {
      return formatMessage(strings.setResult);
    }
    case TransactionType.VOTE: {
      return formatMessage(strings.vote);
    }
    case TransactionType.WITHDRAW: {
      return formatMessage(strings.withdraw);
    }
    default: {
      console.error(`Invalid txType: ${txType}`); // eslint-disable-line
      return '';
    }
  }
}
