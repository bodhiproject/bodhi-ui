import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { ImportantNote } from 'components';

const messages = defineMessages({
  currentAllowanceTitle: {
    id: 'note.currentAllowanceTitle',
    defaultMessage: 'Current Allowance: {allowance} NBOT',
  },
  currentAllowanceMessage: {
    id: 'note.currentAllowanceMessage',
    defaultMessage: 'This indicates your current NBOT approved amount. You may use up to this amount. If the current approved amount is greater than 0 and you want to increase the approved amount, you will have to do a transaction to reset it back to 0 first.',
  },
});

const CurrentAllowanceNote = ({ intl, allowance }) => {
  const heading = intl.formatMessage(messages.currentAllowanceTitle, { allowance });
  const message = intl.formatMessage(messages.currentAllowanceMessage);
  return <ImportantNote heading={heading} message={message} />;
};

export default injectIntl(CurrentAllowanceNote);
