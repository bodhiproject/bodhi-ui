import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { TextField, InputAdornment, FormControl, FormHelperText, Button as _Button } from '@material-ui/core';
import { Section } from './components';

const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;

const messages = defineMessages({
  createAddOutcomeMsg: {
    id: 'create.addOutcome',
    defaultMessage: 'Add Outcome',
  },
  createOutcomeNameMsg: {
    id: 'create.outcomeName',
    defaultMessage: 'Outcome Name',
  },
  strOutcomesMsg: {
    id: 'str.outcomes',
    defaultMessage: 'Outcomes',
  },
});

const Outcomes = observer(({ store: { createEvent } }) => (
  <Section column title={messages.strOutcomesMsg}>
    {createEvent.outcomes.map((outcome, i) => (
      <Outcome key={i} outcome={outcome} createEvent={createEvent} i={i} />
    ))}
    {createEvent.outcomes.length < MAX_OPTION_NUMBER && (
      <AddButton onClick={() => createEvent.addOutcome('')} />
    )}
  </Section>
));

const AddButton = injectIntl(({ intl, ...props }) => (
  <Button {...props}>+ {intl.formatMessage(messages.createAddOutcomeMsg)}</Button>
));

const Button = styled(_Button).attrs({ variant: 'raised' })`
  margin-top: ${props => props.theme.padding.unit.px} !important;
  width: 150px;
`;

const Outcome = injectIntl(observer(({ outcome, createEvent, i, intl }) => (
  <div>
    <FormControl fullWidth>
      <TextField
        fullWidth
        value={outcome}
        onChange={e => createEvent.outcomes[i] = e.target.value}
        onBlur={() => createEvent.validateOutcome(i)}
        placeholder={intl.formatMessage(messages.createOutcomeNameMsg)}
        error={Boolean(createEvent.error.outcomes[i])}
        InputProps={{
          startAdornment: <InputAdornment position="start">#{i + 1}</InputAdornment>,
        }}
      />
      {createEvent.outcomes.length > MIN_OPTION_NUMBER && (
        <RemoveIcon onClick={() => createEvent.outcomes.splice(i, 1)} />
      )}
      {!!createEvent.error.outcomes[i] && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.outcomes[i] })}</FormHelperText>}
    </FormControl>
  </div>
)));

const RemoveIcon = styled.i.attrs({ className: 'icon iconfont icon-close' })`
  position: absolute;
  right: 5px;
  top: 8px;
  cursor: pointer;
`;

export default inject('store')(Outcomes);
