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

// export function renderCardString(transaction, intl) {
//   const { txType, amount } = transaction;
//   let { eventName, resultName } = transaction;
//   if (eventName && eventName.length > 20) eventName = `${eventName.slice(0, 6)}...${eventName.slice(-6)}`;
//   if (resultName && resultName.length > 20) resultName = `${resultName.slice(0, 6)}...${resultName.slice(-6)}`;

//   switch (txType) {
//     case TransactionType.CREATE_EVENT: {
//       return (
//         <Fragment>
//           <FormattedHTMLMessage
//             id="historyEntry.createEvent"
//             defaultMessage={'{who} <b>Created</b> "<b>{eventName}</b>" Event'}
//             values={{ who: intl.formatMessage(messages.strYou), eventName }}
//           />
//         </Fragment>
//       );
//     }
//     case TransactionType.BET: {
//       return (
//         <Fragment>
//           <FormattedHTMLMessage
//             id="historyEntry.bet"
//             defaultMessage={'{who} <b>Betted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event'}
//             values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
//           />
//         </Fragment>
//       );
//     }
//     case TransactionType.RESULT_SET: {
//       return (
//         <Fragment>
//           <FormattedHTMLMessage
//             id="historyEntry.setResult"
//             defaultMessage={'{who} <b>Set</b> "<b>{resultName}</b>" as <b>result</b> in "<b>{eventName}</b>" Event'}
//             values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
//           />
//         </Fragment>
//       );
//     }
//     case TransactionType.VOTE: {
//       return (
//         <Fragment>
//           <FormattedHTMLMessage
//             id="historyEntry.vote"
//             defaultMessage={'{who} <b>Voted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event'}
//             values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
//           />
//         </Fragment>
//       );
//     }
//     case TransactionType.WITHDRAW: {
//       return (
//         <Fragment>
//           <FormattedHTMLMessage
//             id="historyEntry.withdraw"
//             defaultMessage={'{who} <b>Withdrew {amount} NBOT</b> from "<b>{eventName}</b>" Event'}
//             values={{ who: intl.formatMessage(messages.strYou), amount, eventName }}
//           />
//         </Fragment>
//       );
//     }
//     default: {
//       console.error(`Invalid txType: ${txType}`); // eslint-disable-line
//       return (
//         <Fragment>
//           {`Invalid txType: ${txType}`}
//         </Fragment>
//       );
//     }
//   }
// }

// export function getStatusString(txStatus, intl) {
//   switch (txStatus) {
//     case TransactionStatus.PENDING: {
//       return intl.formatMessage(messages.strPendingMsg);
//     }
//     case TransactionStatus.SUCCESS: {
//       return intl.formatMessage(messages.strSuccessMsg);
//     }
//     default: {
//       return intl.formatMessage(messages.strFailMsg);
//     }
//   }
// }

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
