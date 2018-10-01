import React from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages } from 'react-intl';
import { Select, MenuItem } from '@material-ui/core';

import { Section } from './components';

const messages = defineMessages({
  languagSelector: {
    id: 'create.languagSelector',
    defaultMessage: 'Language',
  },
});

const LanguageSelector = observer(({ store: { createEvent } }) => (
  <Section title={messages.languagSelector}>
    <Select
      value={createEvent.language}
      onChange={(e) => createEvent.language = e.target.value}
      name="lang"
    >
      <MenuItem value="English">English</MenuItem>
      <MenuItem value="中文">中文</MenuItem>
      <MenuItem value="한국어">한국어</MenuItem>
    </Select>
  </Section>
));


export default inject('store')(LanguageSelector);
