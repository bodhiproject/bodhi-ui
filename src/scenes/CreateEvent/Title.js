import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { FormControl, TextField, FormHelperText } from '@material-ui/core';
import { Section } from './components';

const messages = defineMessages({
  createNamePlaceholderMsg: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
  },
  eventUnconfirmedMessage: {
    id: 'oracle.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
  createTitleMsg: {
    id: 'create.title',
    defaultMessage: 'Title',
  },
});

const Title = observer(({ store: { createEvent }, intl }) => (
  <Section title={messages.createTitleMsg}>
    <FormControl fullWidth>
      <TextField
        placeholder={intl.formatMessage(messages.createNamePlaceholderMsg)}
        value={createEvent.title}
        onChange={e => createEvent.title = e.target.value}
        onBlur={createEvent.validateTitle}
        error={!!createEvent.error.title}
        fullWidth
      />
      {!!createEvent.error.title && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.title })}</FormHelperText>}
    </FormControl>
  </Section>
));

export default injectIntl(inject('store')(Title));
