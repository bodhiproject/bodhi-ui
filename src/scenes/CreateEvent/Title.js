/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { FormControl, TextField, FormHelperText, InputAdornment } from '@material-ui/core';
import Section from './Section';


const Title = observer(({ store: { createEvent }, intl }) => (
  <Section title='create.title'>
    <FormControl fullWidth>
      <TextField
        placeholder={intl.formatMessage({ id: 'create.namePlaceholder' })}
        value={createEvent.title}
        onChange={e => createEvent.title = e.target.value}
        error={!!createEvent.error.title}
        fullWidth
      />
      {!!createEvent.error.title && <FormHelperText error>{createEvent.error.title}</FormHelperText>}
    </FormControl>
  </Section>
));

export default injectIntl(inject('store')(Title));
