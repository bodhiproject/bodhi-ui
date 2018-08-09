import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { FormControl, TextField, FormHelperText, Button as _Button } from '@material-ui/core';
import { Section, SelectAddressDialog } from './components';

const messages = defineMessages({
  createResultSetterPlaceholderMsg: {
    id: 'create.resultSetterPlaceholder',
    defaultMessage: 'Enter the address of the result setter or select your own address',
  },
  createSelectMyAddressMsg: {
    id: 'create.selectMyAddress',
    defaultMessage: 'Select My Address',
  },
  strResultSetterMsg: {
    id: 'str.resultSetter',
    defaultMessage: 'Result Setter',
  },
});

const ResultSetter = observer(({ store: { createEvent } }) => (
  <Section column title={messages.strResultSetterMsg}>
    <Input createEvent={createEvent} />
    <SelectAddressButton onClick={() => createEvent.resultSetterDialogOpen = true} />
    <SelectAddressDialog />
  </Section>
));

const Input = injectIntl(observer(({ intl, createEvent }) => (
  <FormControl fullWidth>
    <TextField
      value={createEvent.resultSetter}
      onChange={e => createEvent.resultSetter = e.target.value}
      placeholder={intl.formatMessage(messages.createResultSetterPlaceholderMsg)}
      onBlur={createEvent.validateResultSetter}
      error={!!createEvent.error.resultSetter}
    />
    {!!createEvent.error.resultSetter && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.resultSetter })}</FormHelperText>}
  </FormControl>
)));

const SelectAddressButton = injectIntl(({ intl, ...props }) => (
  <Button {...props}>
    {intl.formatMessage(messages.createSelectMyAddressMsg)}
  </Button>
));

const Button = styled(_Button).attrs({ variant: 'raised' })`
  margin-top: ${props => props.theme.padding.unit.px} !important;
  width: 200px;
`;

export default inject('store')(ResultSetter);
