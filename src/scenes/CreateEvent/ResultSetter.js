import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { FormControl, TextField, FormHelperText, Button, withStyles } from '@material-ui/core';
import { Section, SelectAddressDialog } from './components';

import styles from './styles';

const messages = defineMessages({
  resultSetterPlaceholder: {
    id: 'create.resultSetterPlaceholder',
    defaultMessage: 'e.g. qMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna',
  },
  select: {
    id: 'create.select',
    defaultMessage: 'Select',
  },
  strResultSetterMsg: {
    id: 'str.resultSetter',
    defaultMessage: 'Result Setter',
  },
});

const ResultSetter = ({ store: { createEvent } }) => (
  <Section column title={messages.strResultSetterMsg}>
    <Input createEvent={createEvent} />
    <SelectAddressDialog />
  </Section>
);

const Input = injectIntl(withStyles(styles, { withTheme: true })(observer(({ classes, intl, createEvent }) => (
  <FormControl fullWidth>
    <TextField
      InputProps={{
        classes: { input: classes.createEventTextField },
      }}
      value={createEvent.resultSetter}
      onChange={e => createEvent.resultSetter = e.target.value}
      placeholder={intl.formatMessage(messages.resultSetterPlaceholder)}
      onBlur={createEvent.validateResultSetter}
      error={!!createEvent.error.resultSetter}
    />
    {!!createEvent.error.resultSetter && (
      <FormHelperText error>{intl.formatMessage({ id: createEvent.error.resultSetter })}</FormHelperText>
    )}
  </FormControl>
))));

const SelectAddressButton = injectIntl(withStyles(styles)(({ classes, intl, ...props }) => (
  <Button className={classes.selectAddressButton} variant="contained" color="primary" size="small" {...props}>
    {intl.formatMessage(messages.select)}
  </Button>
)));

export default inject('store')(observer(ResultSetter));
