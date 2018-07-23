import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { FormControl, TextField, FormHelperText, Button } from '@material-ui/core';
import Section from './Section';
import SelectAddressDialog from './components/SelectAddressDialog';


const ResultSetter = observer(({ store: { createEvent } }) => (
  <Section column title='str.resultSetter'>
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
      placeholder={intl.formatMessage({ id: 'create.resultSetterPlaceholder' })}
      error={!!createEvent.error.resultSetter}
    />
    {!!createEvent.error.resultSetter && <FormHelperText error>{createEvent.error.resultSetter}</FormHelperText>}
  </FormControl>
)));

const SelectAddressButton = injectIntl(({ intl, ...props }) => (
  <Button {...props}>
    {intl.formatMessage({ id: 'create.selectMyAddress' })}
  </Button>
));

export default inject('store')(ResultSetter);
