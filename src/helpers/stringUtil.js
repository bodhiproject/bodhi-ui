import { defineMessages } from 'react-intl';
import { TransactionStatus } from 'constants';

import { getIntlProvider } from './i18nUtil';
import { shortenText } from './utility';

const strings = defineMessages({
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  strSuccessMsg: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  strFailMsg: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
  },
});
export function getStatusString(txStatus, intl) {
  const { formatMessage } = getIntlProvider(intl.locale, intl.messages);
  switch (txStatus) {
    case TransactionStatus.PENDING: {
      return formatMessage(strings.strPendingMsg);
    }
    case TransactionStatus.SUCCESS: {
      return formatMessage(strings.strSuccessMsg);
    }
    default: {
      return formatMessage(strings.strFailMsg);
    }
  }
}

export function getAddressName(account, intl, address, name) {
  return (account && account.toLowerCase() === address && intl.formatMessage(strings.strYou))
    || name
    || shortenText(address, 6);
}
