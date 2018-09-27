import React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { ImportantNote } from 'components';

const messages = defineMessages({
  currentAllowanceTitle: {
    id: 'note.currentAllowanceTitle',
    defaultMessage: 'Current BOT Allowance: {allowance}',
  },
  currentAllowanceMessage: {
    id: 'note.currentAllowanceMessage',
    defaultMessage: 'This indicates your current BOT approved amount. You may use up to this amount. If you want to increase the approved amount, you will have to do a transaction to reset it back to zero first.',
  },
});

const CurrentAllowanceNote = ({ intl, allowance }) => {
  const heading = intl.formatMessage(messages.currentAllowanceTitle, { allowance });
  const message = intl.formatMessage(messages.currentAllowanceMessage);
  return <ImportantNote heading={heading} message={message} />;
};

export default injectIntl(CurrentAllowanceNote);
